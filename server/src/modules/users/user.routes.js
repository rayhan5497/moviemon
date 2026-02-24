const express = require('express');
const userController = require('./user.controller');

const authMiddleware = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

router.patch(
  '/me',
  authMiddleware,
  upload.single('avatar'),
  userController.updateProfile
);
router.delete('/me', authMiddleware, userController.deleteAccount);

router.get('/saved', authMiddleware, userController.getSavedMovies);
router.get('/watchlater', authMiddleware, userController.getWatchLaterMovies);
router.get('/watch-history', authMiddleware, userController.getWatchHistory);

router.post('/saved/:movieId', authMiddleware, userController.setSavedMovie);
router.post(
  '/watchLater/:movieId',
  authMiddleware,
  userController.setWatchLaterMovie
);
router.post(
  '/watchlater/:movieId',
  authMiddleware,
  userController.setWatchLaterMovie
);
router.post(
  '/watch-history/:movieId',
  authMiddleware,
  userController.addWatchHistory
);

module.exports = router;
