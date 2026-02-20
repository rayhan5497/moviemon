const AppError = require('../../shared/errors/AppError');
const openSubtitleIntegration = require('./integration/openSubtitle.integration');
const subdlIntegration = require('./integration/subdl.integration');

async function fetchSubtitleList(mediaId, season, episode) {
  let subtitleList;

  try {
    subtitleList = await openSubtitleIntegration.fetchSubtitleList(
      mediaId,
      season,
      episode
    );
  } catch (err) {
    console.warn(`Open Subtitle fetch failed: ${err.message}`);
  }

  if (!subtitleList) {
    try {
      subtitleList = await subdlIntegration.fetchSubtitleList(
        mediaId,
        season,
        episode
      );
    } catch (err) {
      console.warn(`subDL Subtitle fetch failed: ${err.message}`);
    }
  }

  if (!subtitleList) {
    throw new AppError('Subtitle not found in any source', 404);
  }

  return subtitleList;
}

async function fetchSubtitleFile(opensubtitleFileId, subdlFilePath) {
  let subtitle;
  if (opensubtitleFileId) {
    try {
      subtitle = await openSubtitleIntegration.fetchSubtitleFile(
        opensubtitleFileId
      );
    } catch (err) {
      console.warn(`Open Subtitle file fetch failed: ${err.message}`);
    }
  }

  if (!subtitle) {
    try {
      subtitle = await subdlIntegration.fetchSubtitleFile(subdlFilePath);
    } catch (err) {
      console.warn(`subDL Subtitle file fetch failed: ${err.message}`);
    }
  }

  if (!subtitle) {
    throw new AppError('Subtitle file not found in any source', 404);
  }

  return subtitle;
}

async function getSubtitleList(movieId, season, episode) {
  if (!movieId) {
    throw new AppError('Movie id is required', 400);
  }

  return await fetchSubtitleList(movieId, season, episode);
}

async function getSubtitleFile(opensubtitleFileId, subdlFilePath) {
  return await fetchSubtitleFile(opensubtitleFileId, subdlFilePath);
}

module.exports = { getSubtitleList, getSubtitleFile };
