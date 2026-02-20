const asyncHandler = require('../../shared/utils/asyncHandler');
const subtitlesService = require('./subtitles.service');

const getSubtitleList = asyncHandler(async (req, res) => {
  const { mediaId, season, episode } = req.query;
  console.log('mediaId', mediaId);
  const result = await subtitlesService.getSubtitleList(
    mediaId,
    season,
    episode
  );
  res.json(result);
});
const getSubtitleFile = asyncHandler(async (req, res) => {
  const { mediaId, opensubtitleFileId, subdlFilePath, season, episode } = req.query;
  const result = await subtitlesService.getSubtitleFile(
    opensubtitleFileId,
    subdlFilePath,
    mediaId,
    season,
    episode
  );
  res.json(result);
});

module.exports = { getSubtitleList, getSubtitleFile };
