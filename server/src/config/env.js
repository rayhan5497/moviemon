const dotenv = require('dotenv');

dotenv.config();

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

  OPEN_SUBTITLES_API_BASE_URL: process.env.OPEN_SUBTITLES_API_BASE_URL || '',
  OPEN_SUBTITLES_API_KEY: process.env.OPEN_SUBTITLES_API_KEY || '',
  SUBDL_API_BASE_URL: process.env.SUBDL_API_BASE_URL || '',
  SUBDL_API_KEY: process.env.SUBDL_API_KEY || '',
  SUBTITLES_API_KEY_MODE: process.env.SUBTITLES_API_KEY_MODE || 'bearer',

  OPEN_SUBTITLE_USERNAME: process.env.OPEN_SUBTITLE_USERNAME || '',
  OPEN_SUBTITLE_PASSWORD: process.env.OPEN_SUBTITLE_PASSWORD || '',

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
