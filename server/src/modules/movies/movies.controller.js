const asyncHandler = require('../../shared/utils/asyncHandler');
const moviesService = require('./movies.service');
const logger = require('../../config/logger');

const getMovies = asyncHandler(async (req, res) => {
  const start = Date.now();
  const path = req.originalUrl.replace('/api/movies', '');
  const result = await moviesService.getMovies(path);
  logger.info('[Controller] getMovies — %dms [path: %s]', Date.now() - start, path);
  res.json(result);
});

const getVideoSrc = asyncHandler(async (req, res) => {
  const start = Date.now();
  const { query } = req;
  const result = await moviesService.getVideoSrc(query);
  logger.info('[Controller] getVideoSrc — %dms [query: %s]', Date.now() - start, query?.query);
  res.json(result);
});

module.exports = { getMovies, getVideoSrc };