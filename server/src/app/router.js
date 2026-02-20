const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const moviesRoutes = require('../modules/movies/movies.routes');
const subtitlesRoutes = require('../modules/subtitles/subtitles.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const userRoutes = require('../modules/users/user.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/movies', moviesRoutes);
router.use('/subtitles', authMiddleware, subtitlesRoutes);
router.use('/users', userRoutes);

module.exports = router;
