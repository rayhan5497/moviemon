const fs = require('fs');
const path = require('path');
const readline = require('readline');
const zlib = require('zlib');
const { env } = require('../../config/env');
const logger = require('../../config/logger');

let activeDownload = null;

function getDatasetPath() {
  if (env.IMDB_RATINGS_DATASET_PATH) {
    return env.IMDB_RATINGS_DATASET_PATH;
  }

  return path.resolve(__dirname, '../../../data/imdb/title.ratings.tsv.gz');
}

function getSyncIntervalMs() {
  return env.IMDB_SYNC_INTERVAL_HOURS * 60 * 60 * 1000;
}

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function isDatasetFresh(filePath) {
  try {
    const stat = await fs.promises.stat(filePath);
    return Date.now() - stat.mtimeMs < getSyncIntervalMs();
  } catch {
    return false;
  }
}

async function downloadLatestRatingsDataset(options = {}) {
  const { force = false } = options;
  const datasetPath = getDatasetPath();
  const fresh = await isDatasetFresh(datasetPath);

  if (!force && fresh) {
    return datasetPath;
  }

  if (activeDownload) {
    return activeDownload;
  }

  activeDownload = (async () => {
    await fs.promises.mkdir(path.dirname(datasetPath), { recursive: true });

    const response = await fetch(env.IMDB_RATINGS_DATASET_URL);

    if (!response.ok) {
      throw new Error(
        `IMDb dataset download failed: ${response.status} ${response.statusText}`
      );
    }

    const tempPath = `${datasetPath}.tmp`;
    const buffer = Buffer.from(await response.arrayBuffer());

    await fs.promises.writeFile(tempPath, buffer);
    await fs.promises.rename(tempPath, datasetPath);

    return datasetPath;
  })();

  try {
    return await activeDownload;
  } finally {
    activeDownload = null;
  }
}

async function ensureDatasetAvailable() {
  const datasetPath = getDatasetPath();

  if (await fileExists(datasetPath)) {
    if (!(await isDatasetFresh(datasetPath))) {
      void downloadLatestRatingsDataset({ force: true }).catch((error) => {
        logger.warn('Background IMDb dataset refresh failed: %s', error.message);
      });
    }

    return datasetPath;
  }

  return downloadLatestRatingsDataset({ force: true });
}

async function scanDatasetForIds(imdbIds) {
  const ids = Array.from(new Set(imdbIds.filter(Boolean)));

  if (ids.length === 0) {
    return new Map();
  }

  const datasetPath = await ensureDatasetAvailable();
  const remaining = new Set(ids);
  const results = new Map();
  const fileStream = fs.createReadStream(datasetPath);
  const gunzip = zlib.createGunzip();
  const reader = readline.createInterface({
    input: fileStream.pipe(gunzip),
    crlfDelay: Infinity,
  });

  try {
    for await (const line of reader) {
      if (!line || line.startsWith('tconst\t')) {
        continue;
      }

      const [tconst, averageRating, numVotes] = line.split('\t');

      if (!remaining.has(tconst)) {
        continue;
      }

      results.set(tconst, {
        imdbRating: Number(averageRating),
        imdbVoteCount: Number(numVotes),
      });
      remaining.delete(tconst);

      if (remaining.size === 0) {
        break;
      }
    }
  } finally {
    reader.close();
    gunzip.destroy();
    fileStream.destroy();
  }

  return results;
}

async function lookupRatingsByIds(imdbIds) {
  try {
    return await scanDatasetForIds(imdbIds);
  } catch (error) {
    logger.warn('IMDb ratings lookup failed: %s', error.message);
    return new Map();
  }
}

module.exports = {
  downloadLatestRatingsDataset,
  getDatasetPath,
  lookupRatingsByIds,
};
