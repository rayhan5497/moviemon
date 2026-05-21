const logger = require('../../config/logger');

const MAX_ENTRIES = 5000;
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

const cache = new Map();
let stats = { hits: 0, misses: 0, sets: 0, evictions: 0 };

function perfLog(label, start, extra = '') {
  const elapsed = Date.now() - start;
  if (elapsed >= 10) {
    logger.info('[Cache] %s — %dms %s', label, elapsed, extra);
  } else {
    logger.debug('[Cache] %s — %dms %s', label, elapsed, extra);
  }
}

function isExpired(entry) {
  return Date.now() > entry.expiresAt;
}

function evictIfNeeded() {
  if (cache.size < MAX_ENTRIES) {
    return;
  }

  // Remove all expired entries first
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }

  // If still over limit, delete oldest by expiresAt
  if (cache.size >= MAX_ENTRIES) {
    let oldestKey = null;
    let oldestExpiry = Infinity;
    for (const [key, entry] of cache) {
      if (entry.expiresAt < oldestExpiry) {
        oldestExpiry = entry.expiresAt;
        oldestKey = key;
      }
    }
    if (oldestKey) {
      cache.delete(oldestKey);
      stats.evictions++;
    }
  }
}

// ---------- Public API (ratings only) ----------

function getRating(imdbId) {
  const key = `rating:${imdbId}`;
  const entry = cache.get(key);

  if (entry && !isExpired(entry)) {
    stats.hits++;
    return entry.value;
  }

  if (entry) cache.delete(key);
  stats.misses++;
  return null;
}

function setRating(imdbId, ratingData, ttlMs = DEFAULT_TTL_MS) {
  const key = `rating:${imdbId}`;
  evictIfNeeded();
  cache.set(key, {
    value: ratingData,
    expiresAt: Date.now() + ttlMs,
  });
  stats.sets++;
}

function getBulkRatings(imdbIds) {
  const start = Date.now();
  const result = new Map();
  const missing = [];

  for (const id of imdbIds) {
    if (!id) continue;
    const cached = getRating(id);
    if (cached) {
      result.set(id, cached);
    } else {
      missing.push(id);
    }
  }

  perfLog('getBulkRatings', start, `[requested: ${imdbIds.length}, cached: ${result.size}, missing: ${missing.length}]`);
  return { cached: result, missing };
}

function getStats() {
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(1) : 'N/A';
  return {
    ...stats,
    size: cache.size,
    maxSize: MAX_ENTRIES,
    hitRate: `${hitRate}%`,
  };
}

function clear() {
  cache.clear();
  stats = { hits: 0, misses: 0, sets: 0, evictions: 0 };
  logger.info('[Cache] Cleared');
}

function logStats() {
  const s = getStats();
  logger.info(
    '[Cache] Stats — size: %d/%d, hits: %d, misses: %d, hitRate: %s, evictions: %d',
    s.size,
    s.maxSize,
    s.hits,
    s.misses,
    s.hitRate,
    s.evictions
  );
}

module.exports = {
  getRating,
  setRating,
  getBulkRatings,
  getStats,
  clear,
  logStats,
};