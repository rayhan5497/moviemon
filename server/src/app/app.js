const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./router');
const requestLogger = require('../middlewares/requestLogger.middleware');
const errorMiddleware = require('../middlewares/error.middleware');
const AppError = require('../shared/errors/AppError');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(requestLogger);

  app.use('/api', router);

  app.use((req, res, next) => next(new AppError('Not Found', 404)));

  app.use(errorMiddleware);

  return app;
}

module.exports = createApp;
