const mongoose = require('mongoose');
const { env } = require('../../config/env');
const logger = require('../../config/logger');
const MediaExternalMapping = require('./mediaExternalMapping.model');
const {
  downloadLatestRatingsDataset,
  lookupRatingsByIds,
} = require('./imdbRatings.service');
const { fetchTmdbImdbId } = require('./movies.integration');

let syncTimer = null;
let activeSync = null;

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

async function refreshMappingsFromTmdb(docs) {
  const refreshed = [];

  for (let index = 0; index < docs.length; index += 5) {
    const batch = docs.slice(index, index + 5);
    const settled = await Promise.allSettled(
      batch.map(async (doc) => ({
        tmdbId: doc.tmdbId,
        mediaType: doc.mediaType,
        imdbId:
          (await fetchTmdbImdbId(doc.mediaType, doc.tmdbId)) ||
          doc.imdbId ||
          null,
      }))
    );

    settled.forEach((result, batchIndex) => {
      if (result.status === 'fulfilled') {
        refreshed.push(result.value);
        return;
      }

      const fallbackDoc = batch[batchIndex];
      logger.warn(
        'Failed to refresh TMDb mapping for %s/%s: %s',
        fallbackDoc.mediaType,
        fallbackDoc.tmdbId,
        result.reason.message
      );
      refreshed.push({
        tmdbId: fallbackDoc.tmdbId,
        mediaType: fallbackDoc.mediaType,
        imdbId: fallbackDoc.imdbId || null,
      });
    });
  }

  return refreshed;
}

async function syncMovieMappings() {
  if (!isMongoReady()) {
    return { synced: 0, rated: 0, skipped: true };
  }

  if (activeSync) {
    return activeSync;
  }

  activeSync = (async () => {
    await downloadLatestRatingsDataset({ force: true });

    const docs = await MediaExternalMapping.find(
      {},
      { tmdbId: 1, mediaType: 1, imdbId: 1 }
    ).lean();

    if (docs.length === 0) {
      return { synced: 0, rated: 0 };
    }

    const refreshed = await refreshMappingsFromTmdb(docs);
    const ratingsById = await lookupRatingsByIds(
      refreshed.map((doc) => doc.imdbId).filter(Boolean)
    );
    const now = new Date();

    await MediaExternalMapping.bulkWrite(
      refreshed.map((doc) => {
        const rating = doc.imdbId ? ratingsById.get(doc.imdbId) : null;

        return {
          updateOne: {
            filter: {
              tmdbId: doc.tmdbId,
              mediaType: doc.mediaType,
            },
            update: {
              $set: {
                imdbId: doc.imdbId,
                imdbRating: rating ? rating.imdbRating : null,
                imdbVoteCount: rating ? rating.imdbVoteCount : null,
                lastTmdbSyncAt: now,
                lastImdbSyncAt: rating ? now : null,
              },
            },
            upsert: true,
          },
        };
      })
    );

    return { synced: refreshed.length, rated: ratingsById.size };
  })();

  try {
    return await activeSync;
  } finally {
    activeSync = null;
  }
}

function startMovieMappingsSyncJob() {
  if (syncTimer || !env.IMDB_SYNC_ENABLED) {
    return syncTimer;
  }

  if (env.NODE_ENV !== 'test') {
    void syncMovieMappings().catch((error) => {
      logger.warn('Initial movie mapping sync failed: %s', error.message);
    });
  }

  syncTimer = setInterval(() => {
    void syncMovieMappings().catch((error) => {
      logger.warn('Scheduled movie mapping sync failed: %s', error.message);
    });
  }, env.IMDB_SYNC_INTERVAL_HOURS * 60 * 60 * 1000);

  if (typeof syncTimer.unref === 'function') {
    syncTimer.unref();
  }

  return syncTimer;
}

module.exports = {
  startMovieMappingsSyncJob,
  syncMovieMappings,
};
