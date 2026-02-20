const AppError = require('../../shared/errors/AppError');
const moviesIntegration = require('./movies.integration');

async function getMovies(path) {
  if (!path) {
    throw new AppError('URL path is required', 400);
  }
  return moviesIntegration.fetchMovies(path);
}

async function getVideoSrc(query) {
  if (!query) {
    throw new AppError('Query is required', 400);
  }
  return {
    middleSrc: `https://player.videasy.net/${query.query}`,
    needsTurnstile: true,
    valid: true,
    statusCode: 200,
  };
}

module.exports = { getMovies, getVideoSrc };
