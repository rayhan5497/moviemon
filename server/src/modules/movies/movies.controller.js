const asyncHandler = require('../../shared/utils/asyncHandler');
const moviesService = require('./movies.service');

const getMovies = asyncHandler(async (req, res) => {
  const path = req.originalUrl.replace('/api/movies', '');
  const result = await moviesService.getMovies(path);
  res.json(result);
});
const getVideoSrc = asyncHandler(async (req, res) => {
  const {query} = req;
  const result = await moviesService.getVideoSrc(query);
  res.json(result);
});

module.exports = { getMovies, getVideoSrc };
