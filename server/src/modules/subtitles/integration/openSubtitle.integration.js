const { env } = require('../../../config/env');
const AppError = require('../../../shared/errors/AppError');
const detectVariant = require('../utils/detectSubtitleVariant');
const detectAndExtractSrt = require('../utils/detectAndExtractSrt');
const convertSrtToVtt = require('../utils/convertSrtToVtt');

async function fetchSubtitleList(movieId, season, episode) {
  try {
    if (!env.OPEN_SUBTITLES_API_BASE_URL) {
      throw new AppError('Subtitles API not configured', 503);
    }
    const url = new URL('subtitles', env.OPEN_SUBTITLES_API_BASE_URL);

    url.searchParams.set('tmdb_id', movieId);
    if (season && episode) {
      url.searchParams.set('season_number', season);
      url.searchParams.set('episode_number', episode);
    }

    const headers = {
      'Api-Key': env.OPEN_SUBTITLES_API_KEY,
      'User-Agent': 'moviemon-server-new v1.0.0',
      Accept: 'application/json',
    };

    console.log('url', url);

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new AppError('open subtitles API error', response.status);
    }
    const data = await response.json();

    const subs = data.data.map((s) => {
      const file = s.attributes.files?.[0] || {};
      return {
        id: file.file_id,
        lang: s.attributes.language_name || s.attributes.language,
        iso: s.attributes.language,
        release: s.attributes.release || '',
        variant: detectVariant(s.attributes.release),
        download: null,
      };
    });
    return subs;
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
}

let TOKEN = null;
let TOKEN_EXPIRES = 0;
async function getToken() {
  const pass = env.OPEN_SUBTITLE_PASSWORD;
  const user = env.OPEN_SUBTITLE_USERNAME;
  if (TOKEN && Date.now() < TOKEN_EXPIRES) return TOKEN;

  try {
    const url = new URL('login', env.OPEN_SUBTITLES_API_BASE_URL);

    const headers = {
      'Api-Key': env.OPEN_SUBTITLES_API_KEY,
      'User-Agent': 'moviemon-server-new v1.0.0',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const body = {
      username: user,
      password: pass,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    console.log('response status', response.status);
    if (!response.ok) {
      throw new AppError('open subtitle login failed', response.status);
    }

    const json = await response.json();

    TOKEN = json.token;
    TOKEN_EXPIRES = Date.now() + 23 * 60 * 60 * 1000;
    console.log('token', TOKEN);
    return TOKEN;
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
}

async function fetchSubtitleFile(fileId) {
  try {
    if (!env.OPEN_SUBTITLES_API_BASE_URL) {
      throw new AppError('Subtitles API not configured', 503);
    }
    const token = await getToken();
    const url = new URL('download', env.OPEN_SUBTITLES_API_BASE_URL);

    url.searchParams.set('tmdb_id', fileId);

    const headers = {
      'Api-Key': env.OPEN_SUBTITLES_API_KEY,
      'User-Agent': 'moviemon-server-new v1.0.0',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const body = {
      file_id: fileId,
    };

    console.log('url', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new AppError('open subtitles API error', response.status);
    }
    const { link } = await response.json();
    const res = await fetch(link, {
      headers: { 'User-Agent': 'moviemon-server-new v1.0.0' },
    });
    const buffer = Buffer.from(await res.arrayBuffer());
    const srt = await detectAndExtractSrt(buffer);

    const vtt = await convertSrtToVtt(srt);

    return vtt;
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
}

module.exports = { fetchSubtitleList, fetchSubtitleFile };
