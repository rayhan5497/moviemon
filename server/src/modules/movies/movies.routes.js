const express = require('express');
const moviesController = require('./movies.controller');
const router = express.Router();

router.get('/video-src', moviesController.getVideoSrc);
router.get('/*', moviesController.getMovies);

module.exports = router;
