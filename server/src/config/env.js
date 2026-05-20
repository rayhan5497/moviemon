const dotenv = require('dotenv');

dotenv.config();

function parseBooleanEnv(value, defaultValue) {
  if (value == null || value === '') {
    return defaultValue;
  }

  return !['false', '0', 'no', 'off'].includes(
    String(value).trim().toLowerCase()
  );
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  MOVIES_API_PROVIDER: process.env.MOVIES_API_PROVIDER || 'tmdb',
  MOVIES_API_BASE_URL: process.env.MOVIES_API_BASE_URL || '',
  MOVIES_API_KEY: process.env.MOVIES_API_KEY || '',
  OMDB_API_KEY: process.env.OMDB_API_KEY || '',
  IMDB_RATINGS_DATASET_URL:
    process.env.IMDB_RATINGS_DATASET_URL ||
    'https://datasets.imdbws.com/title.ratings.tsv.gz',
  IMDB_RATINGS_DATASET_PATH:
    process.env.IMDB_RATINGS_DATASET_PATH || '',
  IMDB_SYNC_INTERVAL_HOURS: Number(process.env.IMDB_SYNC_INTERVAL_HOURS) || 24,
  IMDB_SYNC_ENABLED: parseBooleanEnv(process.env.IMDB_SYNC_ENABLED, true),
  IMDB_ENRICHMENT_ENABLED: parseBooleanEnv(
    process.env.IMDB_ENRICHMENT_ENABLED,
    true
  ),

  OPEN_SUBTITLES_API_BASE_URL: process.env.OPEN_SUBTITLES_API_BASE_URL || '',
  OPEN_SUBTITLES_API_KEY: process.env.OPEN_SUBTITLES_API_KEY || '',
  SUBDL_API_BASE_URL: process.env.SUBDL_API_BASE_URL || '',
  SUBDL_API_KEY: process.env.SUBDL_API_KEY || '',
  SUBTITLES_API_KEY_MODE: process.env.SUBTITLES_API_KEY_MODE || 'bearer',

  OPEN_SUBTITLE_USERNAME: process.env.OPEN_SUBTITLE_USERNAME || '',
  OPEN_SUBTITLE_PASSWORD: process.env.OPEN_SUBTITLE_PASSWORD || '',

  // ======================
  // AI
  // ======================
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  COHERE_API_KEY: process.env.COHERE_API_KEY || '',

  // ======================
  // EMAIL 
  // ======================
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
  EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY,
  APP_BASE_URL: process.env.APP_BASE_URL,
};

function ensureEnv() {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  if (env.NODE_ENV === 'test') {
    return;
  }
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

module.exports = { env, ensureEnv };
