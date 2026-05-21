const createApp = require('./src/app/app');
const { connectMongo } = require('./src/config/mongo');
const { ensureEnv, env } = require('./src/config/env');
const logger = require('./src/config/logger');
const imdbSqlite = require('./src/modules/movies/imdbSqlite.service');

async function start() {
  ensureEnv();
  await connectMongo();

  // Initialize SQLite for IMDb ratings (non-blocking, will log errors gracefully)
  try {
    await imdbSqlite.initialize();
  } catch (error) {
    logger.warn('SQLite initialization failed, IMDb enrichment will be limited: %s', error.message);
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });
  return server;
}

if (require.main === module) {
  start().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}