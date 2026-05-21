const AppError = require('../../shared/errors/AppError');
const moviesIntegration = require('./movies.integration');
const logger = require('../../config/logger');

async function getMovies(path) {
  const start = Date.now();

  if (!path) {
    throw new AppError('URL path is required', 400);
  }

  const result = await moviesIntegration.fetchMovies(path);
  logger.info('[Service] getMovies — %dms [path: %s]', Date.now() - start, path);
  return result;
}

async function getVideoSrc(query) {
  const start = Date.now();

  if (!query) {
    throw new AppError('Query is required', 400);
  }

  const result = {
    middleSrc: `https://player.videasy.net/${query.query}`,
    needsTurnstile: true,
    valid: true,
    statusCode: 200,
  };

  logger.info('[Service] getVideoSrc — %dms [query: %s]', Date.now() - start, query.query);
  return result;
}

module.exports = { getMovies, getVideoSrc };