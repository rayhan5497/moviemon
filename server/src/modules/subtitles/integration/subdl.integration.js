const { env } = require('../../../config/env');
const AppError = require('../../../shared/errors/AppError');
const detectVariant = require('../utils/detectSubtitleVariant');
const detectAndExtractSrt = require('../utils/detectAndExtractSrt');
const convertSrtToVtt = require('../utils/convertSrtToVtt');

async function fetchSubtitleList(movieId, season, episode) {
  try {
    if (!env.SUBDL_API_BASE_URL) {
      throw new AppError('Subtitles API not configured', 503);
    }
    const url = new URL('subtitles', env.SUBDL_API_BASE_URL);

    url.searchParams.set('api_key', env.SUBDL_API_KEY);
    url.searchParams.set('tmdb_id', movieId);
    url.searchParams.set('subs_per_page', 30);

    if (season && episode) {
      url.searchParams.set('season_number', season);
      url.searchParams.set('episode_number', episode);
    }

    console.log('url', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new AppError('subdl API error', response.status);
    }
    const data = await response.json();
    let subs;
    subs = data.subtitles.map((s, index) => {
      return {
        id: index,
        lang: s.lang || s.language,
        iso: s.language,
        release: s.release_name || '',
        variant: detectVariant(s.release_name),
        download: s.url,
        season: s.season,
        episode: s.episode,
      };
    });

    if (season && episode) {
      subs.filter((s) => s.season == season && s.episode == episode);
    }
    console.warn('subs', subs);
    return subs;
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
}

async function fetchSubtitleFile(filePath) {
  console.log('sss');
  try {
    if (!env.SUBDL_API_BASE_URL) {
      throw new AppError('subdl subtitles API not configured', 503);
    }

    const link = `https://dl.subdl.com${filePath}`;

    console.log('res', link);
    const res = await fetch(link);

    const buffer = Buffer.from(await res.arrayBuffer());

    const srt = await detectAndExtractSrt(buffer);
    console.log('link', srt);
    const vtt = await convertSrtToVtt(srt);

    return vtt;
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
}

module.exports = { fetchSubtitleList, fetchSubtitleFile };
