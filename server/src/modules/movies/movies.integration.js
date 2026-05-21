const AppError = require('../../shared/errors/AppError');
const http = require('http');
const https = require('https');
const zlib = require('zlib');
const { URL } = require('url');
const { env } = require('../../config/env');
const logger = require('../../config/logger');
const imdbSqlite = require('./imdbSqlite.service');
const imdbCache = require('./imdbCache.service');

const baseUrl = env.MOVIES_API_BASE_URL;
const apiKey = env.MOVIES_API_KEY;

const perfLog = (label, start, extra = '') => {
  const elapsed = Date.now() - start;
  if (elapsed >= 10) {
    logger.info('[Movies] %s — %dms %s', label, elapsed, extra);
  } else {
    logger.debug('[Movies] %s — %dms %s', label, elapsed, extra);
  }
};

function buildTmdbUrl(path) {
  return `${baseUrl + path}${path.includes('?') ? '&' : '?'}api_key=${apiKey}`;
}

function isGzipBuffer(buffer) {
  return buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
}

function unwrapGzip(buffer) {
  let current = buffer;
  for (let attempt = 0; attempt < 3 && isGzipBuffer(current); attempt += 1) {
    current = zlib.gunzipSync(current, { finishFlush: zlib.constants.Z_SYNC_FLUSH });
  }
  return current;
}

function decodeJsonBuffer(buffer, contentEncoding = '') {
  const start = Date.now();
  const encoding = contentEncoding.toLowerCase();
  let data;
  if (encoding.includes('gzip') || isGzipBuffer(buffer)) {
    data = JSON.parse(unwrapGzip(buffer).toString('utf8'));
  } else if (encoding.includes('deflate')) {
    data = JSON.parse(zlib.inflateSync(buffer).toString('utf8'));
  } else if (encoding.includes('br')) {
    data = JSON.parse(zlib.brotliDecompressSync(buffer).toString('utf8'));
  } else {
    data = JSON.parse(buffer.toString('utf8'));
  }
  const sizeKb = (buffer.length / 1024).toFixed(1);
  perfLog('decodeJsonBuffer', start, `[encoding: ${encoding || 'none'}, size: ${sizeKb}KB]`);
  return data;
}

function requestBuffer(url) {
  const start = Date.now();
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
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const sizeKb = (buffer.length / 1024).toFixed(1);
          perfLog('requestBuffer', start, `[status: ${response.statusCode}, size: ${sizeKb}KB, url: ${parsedUrl.pathname}]`);

          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new AppError(response.statusMessage || 'Movie API Error', response.statusCode));
            return;
          }

          resolve({ buffer, contentEncoding: response.headers['content-encoding'] || '' });
        });
      }
    );

    request.on('error', (err) => {
      perfLog('requestBuffer FAILED', start, `[error: ${err.message}]`);
      reject(err);
    });

    request.setTimeout(15000, () => {
      request.destroy();
      perfLog('requestBuffer TIMEOUT', start, `[url: ${parsedUrl.pathname}]`);
      reject(new AppError('TMDb request timed out', 504));
    });

    request.end();
  });
}

async function fetchTmdb(path) {
  const start = Date.now();
  const url = buildTmdbUrl(path);
  const { buffer, contentEncoding } = await requestBuffer(url);

  try {
    const data = decodeJsonBuffer(buffer, contentEncoding);
    const totalMs = Date.now() - start;
    const resultCount = data?.results?.length ?? 0;
    logger.info('[Movies] fetchTmdb — %dms [path: %s, results: %d]', totalMs, path, resultCount);
    return data;
  } catch (error) {
    const totalMs = Date.now() - start;
    logger.warn('[Movies] fetchTmdb FAILED — %dms [path: %s, error: %s]', totalMs, path, error.message);
    throw new AppError(`Failed to parse TMDb response for "${path}": ${error.message}`, 502);
  }
}

// ─── Path / media type helpers ────────────────────────────────────────────

function inferMediaTypeFromPath(path) {
  if (path.startsWith('/movie/')) return 'movie';
  if (path.startsWith('/tv/')) return 'tv';
  if (path.startsWith('/discover/movie')) return 'movie';
  if (path.startsWith('/discover/tv')) return 'tv';
  if (path.startsWith('/trending/movie')) return 'movie';
  if (path.startsWith('/trending/tv')) return 'tv';
  if (path.startsWith('/search/movie')) return 'movie';
  if (path.startsWith('/search/tv')) return 'tv';
  return null;
}

function isTopLevelMediaDetailPath(path) {
  return /^\/(movie|tv)\/\d+(?:\?|$)/.test(path);
}

function looksLikeMovie(node) {
  if (!node || typeof node !== 'object') return false;
  return Boolean(
    node.title || node.original_title || node.release_date ||
    (node.media_type === 'movie' && node.id)
  );
}

function looksLikeTv(node) {
  if (!node || typeof node !== 'object') return false;
  return Boolean(
    node.first_air_date || node.original_name ||
    node.number_of_seasons || node.number_of_episodes ||
    (node.media_type === 'tv' && node.id)
  );
}

function detectMediaType(node) {
  if (!node || typeof node !== 'object') return null;
  if (node.media_type === 'movie' || node.media_type === 'tv') return node.media_type;
  if (looksLikeMovie(node)) return 'movie';
  if (looksLikeTv(node)) return 'tv';
  return null;
}

// ─── Candidate collection (unchanged logic) ──────────────────────────────

function pushCandidate(candidates, node, mediaType) {
  if (!node || typeof node !== 'object' || node.id == null) return;
  const resolvedMediaType = mediaType || detectMediaType(node);
  if (resolvedMediaType !== 'movie' && resolvedMediaType !== 'tv') return;
  candidates.push({ node, tmdbId: Number(node.id), mediaType: resolvedMediaType });
}

function pushCandidateList(candidates, items, fallbackMediaType) {
  if (!Array.isArray(items)) return;
  for (const item of items) {
    const inferredType = item?.media_type || fallbackMediaType || detectMediaType(item);
    pushCandidate(candidates, item, inferredType);
  }
}

function collectMediaCandidates(payload, path) {
  const start = Date.now();
  const candidates = [];
  const pathMediaType = inferMediaTypeFromPath(path);

  if (isTopLevelMediaDetailPath(path)) {
    pushCandidate(candidates, payload, pathMediaType);
  }

  pushCandidateList(candidates, payload?.results, pathMediaType);
  pushCandidateList(candidates, payload?.similar?.results, pathMediaType);
  pushCandidateList(candidates, payload?.recommendations?.results, pathMediaType);

  // Person endpoints embed filmography in combined_credits
  // Each credit item carries its own media_type (movie/tv) so no fallback needed
  if (path.startsWith('/person/')) {
    pushCandidateList(candidates, payload?.combined_credits?.cast, null);
    pushCandidateList(candidates, payload?.combined_credits?.crew, null);
  }

  perfLog('collectMediaCandidates', start, `[candidates: ${candidates.length}]`);
  return candidates;
}

function uniqueCandidates(candidates) {
  const start = Date.now();
  const unique = new Map();
  for (const candidate of candidates) {
    const key = `${candidate.mediaType}:${candidate.tmdbId}`;
    const existing = unique.get(key);
    if (existing) {
      existing.nodes.push(candidate.node);
    } else {
      unique.set(key, { mediaType: candidate.mediaType, tmdbId: candidate.tmdbId, nodes: [candidate.node] });
    }
  }
  perfLog('uniqueCandidates', start, `[unique: ${unique.size} from ${candidates.length}]`);
  return Array.from(unique.values());
}

// ─── IMDB enrichment using SQLite + Cache ────────────────────────────────

/**
 * Attempt to extract imdb_id directly from a TMDb node.
 * Detail endpoints (/movie/123) return imdb_id in the root object.
 * Nested results may also include it on some endpoints.
 */
function extractImdbFromPayload(tmdbId, mediaType, nodes) {
  for (const node of nodes) {
    // TMDb detail responses include imdb_id at the top level
    if (node.imdb_id && typeof node.imdb_id === 'string' && node.imdb_id.startsWith('tt')) {
      return node.imdb_id;
    }
    // Also check external_ids sub-object if present
    if (node.external_ids?.imdb_id && node.external_ids.imdb_id.startsWith('tt')) {
      return node.external_ids.imdb_id;
    }
  }
  return null;
}

function normalizeImdbId(imdbId) {
  if (typeof imdbId !== 'string') return null;
  const trimmed = imdbId.trim();
  return trimmed.startsWith('tt') ? trimmed : null;
}

async function fetchTmdbImdbId(mediaType, tmdbId) {
  const start = Date.now();
  try {
    const externalIds = await fetchTmdb(`/${mediaType}/${tmdbId}/external_ids`);
    const imdbId = normalizeImdbId(externalIds.imdb_id);
    perfLog('fetchTmdbImdbId', start, `[${mediaType}/${tmdbId} → imdbId: ${imdbId || 'N/A'}]`);
    return imdbId;
  } catch (error) {
    perfLog('fetchTmdbImdbId FAILED', start, `[${mediaType}/${tmdbId}, error: ${error.message}]`);
    return null;
  }
}

async function resolveMissingMappings(missingItems) {
  const start = Date.now();
  const resolved = new Map(); // key -> imdbId
  const sqliteWrites = [];

  if (missingItems.length === 0) return resolved;

  // Bulk lookup from SQLite — single query instead of N individual queries
  const sqliteHits = imdbSqlite.bulkGetMappings(missingItems);
  for (const [key, imdbId] of sqliteHits) {
    resolved.set(key, imdbId);
  }

  // Items not found in SQLite need TMDb API fetch
  const trulyMissing = missingItems.filter((item) => !sqliteHits.has(`${item.mediaType}:${item.tmdbId}`));

  const sqliteHitCount = sqliteHits.size;
  const trulyMissingCount = trulyMissing.length;

  if (trulyMissingCount === 0) {
    logger.info('[Movies] resolveMissingMappings — %d from SQLite, 0 to fetch (%dms)', sqliteHitCount, Date.now() - start);
    return resolved;
  }

  // Fetch truly missing from TMDb API in batches of 5
  logger.info('[Movies] resolveMissingMappings — sqliteHits: %d, fetching %d from TMDb [batches of 5]', sqliteHitCount, trulyMissingCount);

  for (let index = 0; index < trulyMissing.length; index += 5) {
    const batchStart = Date.now();
    const batch = trulyMissing.slice(index, index + 5);
    const settled = await Promise.allSettled(
      batch.map(async (item) => ({
        item,
        imdbId: await fetchTmdbImdbId(item.mediaType, item.tmdbId),
      }))
    );

    const succeeded = settled.filter((r) => r.status === 'fulfilled').length;
    const failed = settled.filter((r) => r.status === 'rejected').length;
    perfLog('resolveMissingMappings batch', batchStart, `[batch: ${Math.floor(index / 5) + 1}, succeeded: ${succeeded}, failed: ${failed}]`);

    settled.forEach((result) => {
      if (result.status !== 'fulfilled') return;
      const { item, imdbId } = result.value;
      const key = `${item.mediaType}:${item.tmdbId}`;
      resolved.set(key, imdbId);
      sqliteWrites.push({ tmdbId: item.tmdbId, mediaType: item.mediaType, imdbId });
    });
  }

  // Persist newly resolved mappings to SQLite
  if (sqliteWrites.length > 0) {
    const writeStart = Date.now();
    imdbSqlite.bulkSaveMappings(sqliteWrites);
    perfLog('resolveMissingMappings SQLite write', writeStart, `[writes: ${sqliteWrites.length}]`);
  }

  const fetchedCount = resolved.size - sqliteHitCount;
  logger.info('[Movies] resolveMissingMappings TOTAL — %dms [sqliteHits: %d, fetched: %d, total: %d]', Date.now() - start, sqliteHitCount, fetchedCount, resolved.size);
  return resolved;
}

async function resolveRatings(imdbIds) {
  const start = Date.now();
  const result = new Map();

  if (imdbIds.length === 0) return result;

  // 1. Check in-memory cache
  const { cached, missing } = imdbCache.getBulkRatings(imdbIds);

  for (const [key, value] of cached) {
    result.set(key, value);
  }

  if (missing.length === 0) {
    perfLog('resolveRatings (all in cache)', start);
    return result;
  }

  // 2. Query SQLite for missing
  const sqliteRatings = imdbSqlite.lookupRatings(missing);

  for (const [key, value] of sqliteRatings) {
    result.set(key, value);
    // Populate cache
    imdbCache.setRating(key, value);
  }

  const stillMissing = missing.filter((id) => !sqliteRatings.has(id));

  logger.info('[Movies] resolveRatings — %dms [total: %d, cache: %d, sqlite: %d, notFound: %d]',
    Date.now() - start, imdbIds.length, cached.size, sqliteRatings.size, stillMissing.length);

  return result;
}

function applyRatingsToNodes(candidates, mappingByKey, ratingsByImdbId) {
  const start = Date.now();
  let taggedCount = 0;

  for (const candidate of candidates) {
    const key = `${candidate.mediaType}:${candidate.tmdbId}`;
    const imdbId = mappingByKey.get(key) || null;

    for (const node of candidate.nodes) {
      let tagged = false;

      if (imdbId) {
        node.imdb_id = imdbId;
        tagged = true;
      }

      const rating = imdbId ? ratingsByImdbId.get(imdbId) : null;
      if (rating?.imdbRating != null) {
        node.imdb_rating = rating.imdbRating;
        tagged = true;
      }
      if (rating?.imdbVoteCount != null) {
        node.imdb_vote_count = rating.imdbVoteCount;
        tagged = true;
      }

      if (tagged) taggedCount++;
    }
  }

  perfLog('applyRatingsToNodes', start, `[tagged: ${taggedCount} nodes]`);
}

async function enrichWithImdbRatings(path, payload) {
  const overallStart = Date.now();

  const candidates = uniqueCandidates(collectMediaCandidates(payload, path));

  if (candidates.length === 0) {
    perfLog('enrichWithImdbRatings (no candidates)', overallStart);
    return payload;
  }

  // Step 1: Try to extract imdb_id directly from payload (works for detail endpoints)
  // Step 2: For the rest, check cache → SQLite → TMDb API
  const itemsNeedingMapping = [];
  const mappingByKey = new Map(); // key → imdbId

  for (const candidate of candidates) {
    const key = `${candidate.mediaType}:${candidate.tmdbId}`;
    let imdbId = extractImdbFromPayload(candidate.tmdbId, candidate.mediaType, candidate.nodes);

    if (imdbId) {
      mappingByKey.set(key, imdbId);
      imdbSqlite.saveMapping(candidate.tmdbId, candidate.mediaType, imdbId);
      continue;
    }

    // Check SQLite for persisted mapping
    const sqliteMapping = imdbSqlite.getMapping(candidate.tmdbId, candidate.mediaType);
    if (sqliteMapping?.imdb_id) {
      mappingByKey.set(key, sqliteMapping.imdb_id);
      continue;
    }

    itemsNeedingMapping.push(candidate);
  }

  // Resolve remaining mappings
  const resolvedMappings = await resolveMissingMappings(itemsNeedingMapping);
  for (const [key, imdbId] of resolvedMappings) {
    mappingByKey.set(key, imdbId);
  }

  // Step 3: Look up ratings for all IMDb IDs
  const allImdbIds = [...new Set(Array.from(mappingByKey.values()).filter(Boolean))];
  const ratingsByImdbId = await resolveRatings(allImdbIds);

  // Step 4: Apply ratings to response nodes
  applyRatingsToNodes(candidates, mappingByKey, ratingsByImdbId);

  // Step 5: Log cache stats periodically
  if (imdbCache.getStats) {
    imdbCache.logStats();
  }

  const totalMs = Date.now() - overallStart;
  logger.info('[Movies] enrichWithImdbRatings TOTAL — %dms [candidates: %d, path: %s]', totalMs, candidates.length, path);

  return payload;
}

async function fetchMovies(path) {
  const overallStart = Date.now();
  const data = await fetchTmdb(path);

  if (!env.IMDB_ENRICHMENT_ENABLED) {
    logger.info('[Movies] fetchMovies — %dms [enrichment DISABLED, path: %s]', Date.now() - overallStart, path);
    return data;
  }

  try {
    const enriched = await enrichWithImdbRatings(path, data);
    const totalMs = Date.now() - overallStart;
    logger.info('[Movies] fetchMovies TOTAL — %dms [path: %s]', totalMs, path);
    return enriched;
  } catch (error) {
    logger.warn('[Movies] IMDb enrichment failed for "%s": %s', path, error.message);
    logger.info('[Movies] fetchMovies (fallback, no enrichment) — %dms [path: %s]', Date.now() - overallStart, path);
    return data;
  }
}

module.exports = { fetchMovies, fetchTmdbImdbId };