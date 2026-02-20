const createApp = require('./src/app/app');
const { connectMongo } = require('./src/config/mongo');
const { ensureEnv, env } = require('./src/config/env');
const logger = require('./src/config/logger');

async function start() {
  ensureEnv();
  await connectMongo();
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

