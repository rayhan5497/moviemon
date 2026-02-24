const asyncHandler = require('../../shared/utils/asyncHandler');
const userService = require('./user.service');

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.sub;

  const result = await userService.updateProfile(userId, req.body, req.file);

  res.json(result);
});

const getSavedMovies = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const saved = await userService.getSavedMovies(userId);
  res.json({ saved });
});

const getWatchLaterMovies = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const watchLater = await userService.getWatchLaterMovies(userId);
  res.json({ watchLater });
});

const setSavedMovie = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const saved = await userService.setSavedMovie(
    userId,
    req.params.movieId,
    req.body
  );
  res.json({ saved });
});

const setWatchLaterMovie = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const watchLater = await userService.setWatchLaterMovie(
    userId,
    req.params.movieId,
    req.body
  );
  res.json({ watchLater });
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const watchHistory = await userService.getWatchHistory(userId);
  res.json({ watchHistory });
});

const addWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const watchHistory = await userService.addWatchHistory(
    userId,
    req.params.movieId,
    req.body
  );
  res.json({ watchHistory });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const result = await userService.deleteAccount(userId);
  res.json(result);
});

module.exports = {
  updateProfile,
  getSavedMovies,
  getWatchLaterMovies,
  setSavedMovie,
  setWatchLaterMovie,
  getWatchHistory,
  addWatchHistory,
  deleteAccount,
};
