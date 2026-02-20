const express = require('express');
const subtitlesController = require('./subtitles.controller');

const router = express.Router();

router.get('/list/:mediaId', subtitlesController.getSubtitleList);
router.get('/file/:mediaId', subtitlesController.getSubtitleFile);

module.exports = router;
