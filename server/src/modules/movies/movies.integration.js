const AppError = require('../../shared/errors/AppError');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const zlib = require('zlib');
const { URL } = require('url');
const { env } = require('../../config/env');
const logger = require('../../config/logger');
const MediaExternalMapping = require('./mediaExternalMapping.model');
const { lookupRatingsByIds } = require('./imdbRatings.service');

const baseUrl = env.MOVIES_API_BASE_URL;
const apiKey = env.MOVIES_API_KEY;

function buildTmdbUrl(path) {
  return `${baseUrl + path}${path.includes('?') ? '&' : '?'}api_key=${apiKey}`;
}

function isGzipBuffer(buffer) {
  return buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
}

function unwrapGzip(buffer) {
  let current = buffer;

  for (let attempt = 0; attempt < 3 && isGzipBuffer(current); attempt += 1) {
    current = zlib.gunzipSync(current, {
      finishFlush: zlib.constants.Z_SYNC_FLUSH,
    });
  }

  return current;
}

function decodeJsonBuffer(buffer, contentEncoding = '') {
  const encoding = contentEncoding.toLowerCase();

  if (encoding.includes('gzip') || isGzipBuffer(buffer)) {
    return JSON.parse(unwrapGzip(buffer).toString('utf8'));
  }

  if (encoding.includes('deflate')) {
    return JSON.parse(zlib.inflateSync(buffer).toString('utf8'));
  }

  if (encoding.includes('br')) {
    return JSON.parse(zlib.brotliDecompressSync(buffer).toString('utf8'));
  }

  return JSON.parse(buffer.toString('utf8'));
}

function requestBuffer(url) {
  const parsedUrl = new URL(url);
  const transport = parsedUrl.protocol === 'http:' ? http : https;

  return new Promise((resolve, reject) => {
    const request = transport.request(
      parsedUrl,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      },
      (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const buffer = Buffer.concat(chunks);

          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(
              new AppError(
                response.statusMessage || 'Movie API Error',
                response.statusCode
              )
            );
            return;
          }

          resolve({
            buffer,
            contentEncoding: response.headers['content-encoding'] || '',
          });
        });
      }
    );

    request.on('error', reject);
    request.end();
  });
}

async function fetchTmdb(path) {
  const url = buildTmdbUrl(path);
  const { buffer, contentEncoding } = await requestBuffer(url);

  try {
    return decodeJsonBuffer(buffer, contentEncoding);
  } catch (error) {
    throw new AppError(
      `Failed to parse TMDb response for "${path}": ${error.message}`,
      502
    );
  }
}

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

function looksLikeMovie(node) {
  if (!node || typeof node !== 'object') {
    return false;
  }

  return Boolean(
    node.title ||
      node.original_title ||
      node.release_date ||
      (node.media_type === 'movie' && node.id)
  );
}

function looksLikeTv(node) {
  if (!node || typeof node !== 'object') {
    return false;
  }

  return Boolean(
    node.first_air_date ||
      node.original_name ||
      node.number_of_seasons ||
      node.number_of_episodes ||
      (node.media_type === 'tv' && node.id)
  );
}

function detectMediaType(node) {
  if (!node || typeof node !== 'object') {
    return null;
  }

  if (node.media_type === 'movie' || node.media_type === 'tv') {
    return node.media_type;
  }

  if (looksLikeMovie(node)) {
    return 'movie';
  }

  if (looksLikeTv(node)) {
    return 'tv';
  }

  return null;
}

function inferMediaTypeFromPath(path) {
  if (path.startsWith('/movie/')) {
    return 'movie';
  }

  if (path.startsWith('/tv/')) {
    return 'tv';
  }

  if (path.startsWith('/discover/movie')) {
    return 'movie';
  }

  if (path.startsWith('/discover/tv')) {
    return 'tv';
  }

  if (path.startsWith('/trending/movie')) {
    return 'movie';
  }

  if (path.startsWith('/trending/tv')) {
    return 'tv';
  }

  if (path.startsWith('/search/movie')) {
    return 'movie';
  }

  if (path.startsWith('/search/tv')) {
    return 'tv';
  }

  return null;
}

function isTopLevelMediaDetailPath(path) {
  return /^\/(movie|tv)\/\d+(?:\?|$)/.test(path);
}

function pushCandidate(candidates, node, mediaType) {
  if (!node || typeof node !== 'object' || node.id == null) {
    return;
  }

  const resolvedMediaType = mediaType || detectMediaType(node);

  if (resolvedMediaType !== 'movie' && resolvedMediaType !== 'tv') {
    return;
  }

  candidates.push({
    node,
    tmdbId: Number(node.id),
    mediaType: resolvedMediaType,
  });
}

function pushCandidateList(candidates, items, fallbackMediaType) {
  if (!Array.isArray(items)) {
    return;
  }

  for (const item of items) {
    const inferredType = item?.media_type || fallbackMediaType || detectMediaType(item);
    pushCandidate(candidates, item, inferredType);
  }
}

function collectMediaCandidates(payload, path) {
  const candidates = [];
  const pathMediaType = inferMediaTypeFromPath(path);

  if (isTopLevelMediaDetailPath(path)) {
    pushCandidate(candidates, payload, pathMediaType);
  }

  pushCandidateList(candidates, payload?.results, pathMediaType);
  pushCandidateList(candidates, payload?.similar?.results, pathMediaType);
  pushCandidateList(candidates, payload?.recommendations?.results, pathMediaType);

  return candidates;
}

function keyFor(mediaType, tmdbId) {
  return `${mediaType}:${tmdbId}`;
}

function uniqueCandidates(candidates) {
  const unique = new Map();

  for (const candidate of candidates) {
    const key = keyFor(candidate.mediaType, candidate.tmdbId);
    const existing = unique.get(key);

    if (existing) {
      existing.nodes.push(candidate.node);
      continue;
    }

    unique.set(key, {
      mediaType: candidate.mediaType,
      tmdbId: candidate.tmdbId,
      nodes: [candidate.node],
    });
  }

  return Array.from(unique.values());
}

async function findCachedMappings(candidates) {
  if (!isMongoReady() || candidates.length === 0) {
    return new Map();
  }

  const filters = candidates.map((candidate) => ({
    tmdbId: candidate.tmdbId,
    mediaType: candidate.mediaType,
  }));

  const docs = await MediaExternalMapping.find({ $or: filters }).lean();

  return new Map(
    docs.map((doc) => [keyFor(doc.mediaType, doc.tmdbId), doc])
  );
}

function normalizeImdbId(imdbId) {
  if (typeof imdbId !== 'string') {
    return null;
  }

  const trimmed = imdbId.trim();
  return trimmed.startsWith('tt') ? trimmed : null;
}

async function fetchTmdbImdbId(mediaType, tmdbId) {
  const externalIds = await fetchTmdb(`/${mediaType}/${tmdbId}/external_ids`);
  return normalizeImdbId(externalIds.imdb_id);
}

async function resolveImdbIds(candidates, mappingByKey) {
  const now = new Date();
  const resolved = new Map();
  const writes = [];

  const missingCandidates = [];

  for (const candidate of candidates) {
    const key = keyFor(candidate.mediaType, candidate.tmdbId);
    const cached = mappingByKey.get(key);

    if (cached?.imdbId) {
      resolved.set(key, cached);
      continue;
    }

    missingCandidates.push(candidate);
  }

  for (let index = 0; index < missingCandidates.length; index += 5) {
    const batch = missingCandidates.slice(index, index + 5);
    const settled = await Promise.allSettled(
      batch.map(async (candidate) => ({
        candidate,
        imdbId: await fetchTmdbImdbId(candidate.mediaType, candidate.tmdbId),
      }))
    );

    settled.forEach((result, batchIndex) => {
      if (result.status !== 'fulfilled') {
        const candidate = batch[batchIndex];
        logger.warn(
          'Failed to fetch TMDb external ids for %s/%s: %s',
          candidate.mediaType,
          candidate.tmdbId,
          result.reason.message
        );
        return;
      }

      const { candidate, imdbId } = result.value;
      const key = keyFor(candidate.mediaType, candidate.tmdbId);
      const cached = mappingByKey.get(key);
      const nextMapping = {
        tmdbId: candidate.tmdbId,
        mediaType: candidate.mediaType,
        imdbId,
        imdbRating: cached?.imdbRating ?? null,
        imdbVoteCount: cached?.imdbVoteCount ?? null,
        lastTmdbSyncAt: now,
        lastImdbSyncAt: cached?.lastImdbSyncAt ?? null,
      };

      resolved.set(key, nextMapping);
      mappingByKey.set(key, nextMapping);
      writes.push(nextMapping);
    });
  }

  if (isMongoReady() && writes.length > 0) {
    await MediaExternalMapping.bulkWrite(
      writes.map((mapping) => ({
        updateOne: {
          filter: {
            tmdbId: mapping.tmdbId,
            mediaType: mapping.mediaType,
          },
          update: {
            $set: {
              imdbId: mapping.imdbId,
              imdbRating: mapping.imdbRating,
              imdbVoteCount: mapping.imdbVoteCount,
              lastTmdbSyncAt: mapping.lastTmdbSyncAt,
              lastImdbSyncAt: mapping.lastImdbSyncAt,
            },
          },
          upsert: true,
        },
      }))
    );
  }

  return resolved;
}

async function hydrateRatings(mappingByKey) {
  const mappingsNeedingRatings = Array.from(mappingByKey.values()).filter(
    (mapping) =>
      mapping?.imdbId &&
      (mapping.imdbRating == null || mapping.imdbVoteCount == null)
  );

  if (mappingsNeedingRatings.length === 0) {
    return;
  }

  const ratingsById = await lookupRatingsByIds(
    mappingsNeedingRatings.map((mapping) => mapping.imdbId)
  );
  const now = new Date();
  const writes = [];

  for (const mapping of mappingsNeedingRatings) {
    const rating = ratingsById.get(mapping.imdbId);

    if (!rating) {
      continue;
    }

    mapping.imdbRating = rating.imdbRating;
    mapping.imdbVoteCount = rating.imdbVoteCount;
    mapping.lastImdbSyncAt = now;
    writes.push(mapping);
  }

  if (isMongoReady() && writes.length > 0) {
    await MediaExternalMapping.bulkWrite(
      writes.map((mapping) => ({
        updateOne: {
          filter: {
            tmdbId: mapping.tmdbId,
            mediaType: mapping.mediaType,
          },
          update: {
            $set: {
              imdbId: mapping.imdbId,
              imdbRating: mapping.imdbRating,
              imdbVoteCount: mapping.imdbVoteCount,
              lastTmdbSyncAt: mapping.lastTmdbSyncAt || now,
              lastImdbSyncAt: mapping.lastImdbSyncAt,
            },
          },
          upsert: true,
        },
      }))
    );
  }
}

function applyRatings(candidates, mappingByKey) {
  for (const candidate of candidates) {
    const mapping = mappingByKey.get(keyFor(candidate.mediaType, candidate.tmdbId));

    if (!mapping) {
      continue;
    }

    for (const node of candidate.nodes) {
      if (mapping.imdbId) {
        node.imdb_id = mapping.imdbId;
      }

      if (mapping.imdbRating != null) {
        node.imdb_rating = mapping.imdbRating;
      }

      if (mapping.imdbVoteCount != null) {
        node.imdb_vote_count = mapping.imdbVoteCount;
      }
    }
  }
}

async function enrichWithImdbRatings(path, payload) {
  const candidates = uniqueCandidates(collectMediaCandidates(payload, path));

  if (candidates.length === 0) {
    return payload;
  }

  const mappingByKey = await findCachedMappings(candidates);
  const newlyResolved = await resolveImdbIds(candidates, mappingByKey);

  for (const [key, value] of newlyResolved.entries()) {
    mappingByKey.set(key, value);
  }

  await hydrateRatings(mappingByKey);
  applyRatings(candidates, mappingByKey);

  return payload;
}

async function fetchMovies(path) {
  const data = await fetchTmdb(path);

  if (!env.IMDB_ENRICHMENT_ENABLED) {
    return data;
  }

  try {
    return await enrichWithImdbRatings(path, data);
  } catch (error) {
    logger.warn('IMDb enrichment failed for "%s": %s', path, error.message);
    return data;
  }
}

module.exports = { fetchMovies, fetchTmdbImdbId };
