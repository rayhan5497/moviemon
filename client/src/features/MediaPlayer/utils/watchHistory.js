import { saveWatchHistory } from '@/api/watchHistoryApi';

export const saveWatchProgress = (
  showId,
  seasonNum,
  episodeNum,
  seasonId,
  episodeId,
  mediaType
) => {
  try {
    const watchHistory = JSON.parse(
      localStorage.getItem('watchHistory') || '{}'
    );
    watchHistory[showId] = {
      season: seasonNum,
      episode: episodeNum,
      seasonId: seasonId,
      episodeId: episodeId,
      timestamp: Date.now(),
    };
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  } catch (error) {
    console.error('Error saving watch progress:', error);
  }

  try {
    const stored = localStorage.getItem('userInfo');
    const token = stored ? JSON.parse(stored)?.token : null;
    if (!token) return;

    saveWatchHistory({
      mediaId: Number(showId),
      mediaType: mediaType || (seasonNum || episodeNum ? 'tv' : 'movie'),
      timestamp: Date.now(),
    }).catch((err) => {
      console.error('Error saving watch history to API:', err);
    });
  } catch (error) {
    console.error('Error saving watch history to API:', error);
  }
};

export const getWatchProgress = (showId) => {
  try {
    const watchHistory = JSON.parse(
      localStorage.getItem('watchHistory') || '{}'
    );
    return watchHistory[showId] || null;
  } catch (error) {
    console.error('Error getting watch progress:', error);
    return null;
  }
};

export const clearWatchProgress = (showId) => {
  try {
    const watchHistory = JSON.parse(
      localStorage.getItem('watchHistory') || '{}'
    );
    delete watchHistory[showId];
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  } catch (error) {
    console.error('Error clearing watch progress:', error);
  }
};
