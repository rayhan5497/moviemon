const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const https = require('https');
const Database = require('better-sqlite3');
const { env } = require('../../config/env');
const logger = require('../../config/logger');

let db = null;
let initialised = false;

const DATASET_URL =
  'https://datasets.imdbws.com/title.ratings.tsv.gz';

const perfLog = (label, start, extra = '') => {
  const elapsed = Date.now() - start;
  if (elapsed >= 10) {
    logger.info('[SQLite] %s — %dms %s', label, elapsed, extra);
  } else {
    logger.debug('[SQLite] %s — %dms %s', label, elapsed, extra);
  }
};

// ─── Path helpers ──────────────────────────────────────────────────────────

function getDbPath() {
  return path.resolve(__dirname, '../../../data/imdb/imdb.db');
}

function getDataDir() {
  return path.resolve(__dirname, '../../../data/imdb');
}

function getTsvPath() {
  if (env.IMDB_RATINGS_DATASET_PATH) {
    return env.IMDB_RATINGS_DATASET_PATH;
  }
  return path.join(getDataDir(), 'title.ratings.tsv.gz');
}

function getDownloadUrl() {
  return env.IMDB_RATINGS_DATASET_URL || DATASET_URL;
}

// ─── Schema ────────────────────────────────────────────────────────────────

function createTables(sqliteDb) {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      imdb_id TEXT PRIMARY KEY NOT NULL,
      rating REAL NOT NULL,
      votes INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ratings_imdb_id ON ratings(imdb_id);

    CREATE TABLE IF NOT EXISTS tmdb_mappings (
      tmdb_id INTEGER NOT NULL,
      media_type TEXT NOT NULL CHECK(media_type IN ('movie', 'tv')),
      imdb_id TEXT,
      last_fetched_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (tmdb_id, media_type)
    );

    CREATE INDEX IF NOT EXISTS idx_tmdb_mappings_imdb_id ON tmdb_mappings(imdb_id);
  `);
}

// ─── Streaming HTTPS download ──────────────────────────────────────────────

/**
 * Downloads the IMDb ratings dataset via streaming HTTPS.
 * Writes directly to disk without loading the entire file into memory.
 * Uses a .tmp file and atomic rename for crash safety.
 *
 * Redirect handling: checks for 3xx BEFORE the generic non-2xx check,
 * so redirect URLs are followed correctly.
 */
function downloadRatingsDataset(options = {}) {
  const { force = false } = options;
  const targetPath = getTsvPath();

  if (!force && fs.existsSync(targetPath)) {
    logger.info('[SQLite] Dataset already exists at %s, skipping download', targetPath);
    return Promise.resolve(targetPath);
  }

  const start = Date.now();
  const tmpPath = targetPath + '.tmp.' + Date.now();
  const dir = path.dirname(targetPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const url = getDownloadUrl();
  logger.info('[SQLite] Downloading ratings dataset from %s ...', url);

  return new Promise((resolve, reject) => {
    function doDownload(downloadUrl) {
      const fileStream = fs.createWriteStream(tmpPath);
      let downloadedBytes = 0;

      https.get(downloadUrl, (response) => {
        // Handle redirects FIRST — before the generic status check
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          fileStream.close();
          fs.unlink(tmpPath, () => {});
          logger.debug('[SQLite] Following redirect to %s', response.headers.location);
          doDownload(response.headers.location);
          return;
        }

        // Non-2xx status (not a redirect) → fail
        if (response.statusCode < 200 || response.statusCode >= 300) {
          fileStream.close();
          fs.unlink(tmpPath, () => {});
          reject(new Error(`Download failed with status ${response.statusCode}`));
          return;
        }

        response.pipe(fileStream);
        response.on('data', (chunk) => { downloadedBytes += chunk.length; });
        response.on('end', () => {
          fileStream.end();
          fileStream.on('finish', () => {
            fs.renameSync(tmpPath, targetPath);
            const sizeMb = (downloadedBytes / (1024 * 1024)).toFixed(2);
            logger.info('[SQLite] Dataset downloaded — %dms [size: %sMB]', Date.now() - start, sizeMb);
            resolve(targetPath);
          });
        });
        response.on('error', (err) => {
          fileStream.close();
          fs.unlink(tmpPath, () => {});
          reject(err);
        });
      }).on('error', (err) => {
        fileStream.close();
        fs.unlink(tmpPath, () => {});
        reject(err);
      });
    }

    doDownload(url);
  });
}

/**
 * Ensures the ratings TSV.GZ dataset exists on disk.
 * Downloads it if missing or optionally forces a redownload.
 */
function ensureRatingsDatasetExists(options = {}) {
  const targetPath = getTsvPath();

  if (fs.existsSync(targetPath) && !options.force) {
    return Promise.resolve(targetPath);
  }

  return downloadRatingsDataset(options);
}

// ─── TSV import ────────────────────────────────────────────────────────────

/**
 * Imports the TSV.GZ dataset into SQLite using batched transactions (10k rows per tx).
 * Automatically downloads the dataset if it doesn't exist yet.
 */
async function importTsvToSqlite(sqliteDb) {
  // Ensure dataset exists (download if missing)
  const tsvPath = await ensureRatingsDatasetExists();
  if (!tsvPath) {
    logger.warn('[SQLite] Could not obtain dataset — skipping import');
    return 0;
  }

  const stat = fs.statSync(tsvPath);
  const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
  logger.info('[SQLite] Importing ratings from TSV (%sMB)...', sizeMb);

  const insert = sqliteDb.prepare(
    'INSERT OR IGNORE INTO ratings (imdb_id, rating, votes) VALUES (?, ?, ?)'
  );

  const insertMany = sqliteDb.transaction((batch) => {
    for (const row of batch) {
      insert.run(row.tconst, row.rating, row.votes);
    }
  });

  let totalCount = 0;
  let batch = [];
  let batchCount = 0;

  const stream = fs.createReadStream(tsvPath);
  const gunzip = zlib.createGunzip();
  const reader = readline.createInterface({
    input: stream.pipe(gunzip),
    crlfDelay: Infinity,
  });

  return new Promise((resolve, reject) => {
    reader.on('line', (line) => {
      if (!line || line.startsWith('tconst\t')) return;

      const [tconst, averageRating, numVotes] = line.split('\t');
      if (!tconst || !averageRating || !numVotes) return;

      batch.push({
        tconst,
        rating: Number(averageRating),
        votes: Number(numVotes),
      });

      if (batch.length >= 10000) {
        insertMany(batch);
        totalCount += batch.length;
        batch = [];
        batchCount++;
      }
    });

    reader.on('close', () => {
      // Flush remaining rows
      if (batch.length > 0) {
        insertMany(batch);
        totalCount += batch.length;
      }

      logger.info('[SQLite] Imported %d ratings into SQLite (%d batches)', totalCount, batchCount + 1);
      resolve(totalCount);
    });

    reader.on('error', (err) => {
      reject(err);
    });

    stream.on('error', (err) => {
      reject(err);
    });

    gunzip.on('error', (err) => {
      reject(err);
    });
  });
}

// ─── Refresh (transaction-safe) ───────────────────────────────────────────

/**
 * Refreshes the ratings dataset:
 * 1. Download the latest TSV first (safe, no DB changes)
 * 2. Import into a fresh temporary table
 * 3. Atomically swap: DROP old ratings, rename temp → ratings
 * 4. If anything fails, the existing ratings are preserved intact
 *
 * Keeps tmdb_mappings untouched.
 */
async function refreshRatingsDataset() {
  ensureReady();
  const overallStart = Date.now();

  logger.info('[SQLite] Refreshing ratings dataset...');

  // Step 1: Download latest dataset (will fail fast if download fails)
  const dlStart = Date.now();
  try {
    await ensureRatingsDatasetExists({ force: true });
  } catch (downloadError) {
    logger.error('[SQLite] Refresh download FAILED: %s', downloadError.message);
    logger.info('[SQLite] Attempting reimport from existing dataset file...');
  }
  logger.info('[SQLite] Refresh download phase — %dms', Date.now() - dlStart);

  // Step 2: Import into a temporary table
  const tsvPath = getTsvPath();
  if (!fs.existsSync(tsvPath)) {
    logger.error('[SQLite] Refresh aborted — no dataset file available');
    return 0;
  }

  const tempTableName = 'ratings_new_' + Date.now();

  const createStart = Date.now();
  db.exec(`
    CREATE TABLE ${tempTableName} (
      imdb_id TEXT PRIMARY KEY NOT NULL,
      rating REAL NOT NULL,
      votes INTEGER NOT NULL
    );
  `);
  logger.info('[SQLite] Created temp table %s — %dms', tempTableName, Date.now() - createStart);

  // Reuse the import logic but point it at the temp table
  const importStart = Date.now();
  const insert = db.prepare(
    `INSERT OR IGNORE INTO ${tempTableName} (imdb_id, rating, votes) VALUES (?, ?, ?)`
  );

  const insertMany = db.transaction((batch) => {
    for (const row of batch) {
      insert.run(row.tconst, row.rating, row.votes);
    }
  });

  let totalCount = 0;
  let batch = [];
  let batchCount = 0;

  const stream = fs.createReadStream(tsvPath);
  const gunzip = zlib.createGunzip();
  const reader = readline.createInterface({
    input: stream.pipe(gunzip),
    crlfDelay: Infinity,
  });

  await new Promise((resolve, reject) => {
    reader.on('line', (line) => {
      if (!line || line.startsWith('tconst\t')) return;
      const [tconst, averageRating, numVotes] = line.split('\t');
      if (!tconst || !averageRating || !numVotes) return;
      batch.push({ tconst, rating: Number(averageRating), votes: Number(numVotes) });
      if (batch.length >= 10000) {
        insertMany(batch);
        totalCount += batch.length;
        batch = [];
        batchCount++;
      }
    });

    reader.on('close', () => {
      if (batch.length > 0) {
        insertMany(batch);
        totalCount += batch.length;
      }
      logger.info('[SQLite] Temp table import — %d rows in %d batches (%dms)', totalCount, batchCount + 1, Date.now() - importStart);
      resolve(totalCount);
    });

    reader.on('error', reject);
    stream.on('error', reject);
    gunzip.on('error', reject);
  });

  // Step 3: Atomically swap tables (inside a transaction)
  const swapStart = Date.now();
  const oldTableName = 'ratings_old_' + Date.now();

  try {
    db.exec('BEGIN IMMEDIATE');
    db.exec(`ALTER TABLE ratings RENAME TO ${oldTableName}`);
    db.exec(`ALTER TABLE ${tempTableName} RENAME TO ratings`);
    db.exec(`DROP TABLE IF EXISTS ${oldTableName}`);
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_ratings_imdb_id ON ratings(imdb_id);
    `);
    db.exec('COMMIT');

    logger.info('[SQLite] Atomic table swap — %dms [imported: %d]', Date.now() - swapStart, totalCount);
  } catch (swapError) {
    db.exec('ROLLBACK');
    // Clean up temp table if swap failed
    db.exec(`DROP TABLE IF EXISTS ${tempTableName}`);
    db.exec(`DROP TABLE IF EXISTS ${oldTableName}`);

    logger.error('[SQLite] Refresh swap FAILED: %s — existing ratings preserved', swapError.message);
    throw swapError;
  }

  const totalMs = Date.now() - overallStart;
  logger.info('[SQLite] Refresh complete — %dms [imported: %d ratings]', totalMs, totalCount);
  return totalCount;
}

// ─── Initialization ────────────────────────────────────────────────────────

async function initialize() {
  const start = Date.now();
  const dbPath = getDbPath();

  logger.info('[SQLite] Initializing database at %s', dbPath);

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = -64000');
  db.pragma('temp_store = MEMORY');
  db.pragma('mmap_size = 268435456');

  createTables(db);

  const rowCount = db.prepare('SELECT COUNT(*) as cnt FROM ratings').get();
  if (rowCount.cnt === 0) {
    logger.info('[SQLite] Ratings table empty — bootstrap required');
    try {
      const imported = await importTsvToSqlite(db);
      if (imported > 0) {
        logger.info('[SQLite] Bootstrap complete — imported %d ratings [db: %sMB]', imported, _getDbFileSize());
      } else {
        logger.warn('[SQLite] Bootstrap imported 0 ratings — will work with empty DB (TMDB mappings will accumulate)');
      }
    } catch (error) {
      logger.error('[SQLite] Bootstrap import FAILED: %s', error.message);
      logger.warn('[SQLite] Continuing without ratings data — enrichment will use fallback');
    }
  } else {
    logger.info('[SQLite] Ratings table already has %d rows — bootstrap skipped', rowCount.cnt);
  }

  initialised = true;
  logger.info('[SQLite] Initialized — %dms', Date.now() - start);
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function _getDbFileSize() {
  try {
    const stats = fs.statSync(getDbPath());
    return (stats.size / (1024 * 1024)).toFixed(2);
  } catch {
    return 'N/A';
  }
}

function ensureReady() {
  if (!initialised || !db) {
    throw new Error('SQLite not initialised. Call initialize() first.');
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

function lookupRatings(imdbIds) {
  ensureReady();
  const start = Date.now();

  const ids = [...new Set(imdbIds.filter(Boolean))];
  if (ids.length === 0) {
    perfLog('lookupRatings (empty)', start);
    return new Map();
  }

  const placeholders = ids.map(() => '?').join(',');
  const stmt = db.prepare(`SELECT imdb_id, rating, votes FROM ratings WHERE imdb_id IN (${placeholders})`);
  const rows = stmt.all(...ids);

  const result = new Map();
  for (const row of rows) {
    result.set(row.imdb_id, {
      imdbRating: row.rating,
      imdbVoteCount: row.votes,
    });
  }

  const found = result.size;
  const notFound = ids.length - found;
  perfLog('lookupRatings', start, `[requested: ${ids.length}, found: ${found}, notFound: ${notFound}]`);

  return result;
}

function getMapping(tmdbId, mediaType) {
  ensureReady();
  const start = Date.now();

  const row = db.prepare(
    'SELECT imdb_id, last_fetched_at FROM tmdb_mappings WHERE tmdb_id = ? AND media_type = ?'
  ).get(tmdbId, mediaType);

  if (row) {
    perfLog('getMapping (hit)', start, `[${mediaType}/${tmdbId} → ${row.imdb_id || 'N/A'}]`);
    return row;
  }

  perfLog('getMapping (miss)', start, `[${mediaType}/${tmdbId}]`);
  return null;
}

/**
 * Bulk lookup: returns a Map keyed by "mediaType:tmdbId" → imdb_id string.
 * Uses a single SQL query with batched OR conditions instead of N individual queries.
 */
function bulkGetMappings(items) {
  ensureReady();
  const start = Date.now();

  if (items.length === 0) {
    perfLog('bulkGetMappings (empty)', start);
    return new Map();
  }

  // Build a batched query: (tmdb_id = ? AND media_type = ?) OR (tmdb_id = ? AND media_type = ?) ...
  const conditions = items.map(() => '(tmdb_id = ? AND media_type = ?)').join(' OR ');
  const params = [];
  for (const item of items) {
    params.push(item.tmdbId, item.mediaType);
  }

  const stmt = db.prepare(
    `SELECT tmdb_id, media_type, imdb_id FROM tmdb_mappings WHERE ${conditions}`
  );
  const rows = stmt.all(...params);

  const result = new Map();
  for (const row of rows) {
    if (row.imdb_id) {
      result.set(`${row.media_type}:${row.tmdb_id}`, row.imdb_id);
    }
  }

  const hits = result.size;
  const total = items.length;
  perfLog('bulkGetMappings', start, `[items: ${total}, hits: ${hits}, miss: ${total - hits}]`);
  return result;
}

function saveMapping(tmdbId, mediaType, imdbId) {
  ensureReady();
  const start = Date.now();

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO tmdb_mappings (tmdb_id, media_type, imdb_id, last_fetched_at)
     VALUES (?, ?, ?, strftime('%s', 'now'))`
  );
  stmt.run(tmdbId, mediaType, imdbId);

  perfLog('saveMapping', start, `[${mediaType}/${tmdbId} → ${imdbId || 'N/A'}]`);
}

function bulkSaveMappings(mappings) {
  ensureReady();
  const start = Date.now();

  if (mappings.length === 0) return;

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO tmdb_mappings (tmdb_id, media_type, imdb_id, last_fetched_at)
     VALUES (?, ?, ?, strftime('%s', 'now'))`
  );

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      stmt.run(item.tmdbId, item.mediaType, item.imdbId);
    }
  });

  insertMany(mappings);
  perfLog('bulkSaveMappings', start, `[mappings: ${mappings.length}]`);
}

function close() {
  if (db) {
    db.close();
    db = null;
    initialised = false;
    logger.info('[SQLite] Database closed');
  }
}

module.exports = {
  initialize,
  lookupRatings,
  getMapping,
  bulkGetMappings,
  saveMapping,
  bulkSaveMappings,
  downloadRatingsDataset,
  ensureRatingsDatasetExists,
  refreshRatingsDataset,
  close,
};