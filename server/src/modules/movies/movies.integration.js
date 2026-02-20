const AppError = require('../../shared/errors/AppError');
const { env } = require('../../config/env');
const baseUrl = env.MOVIES_API_BASE_URL;
const apiKey = env.MOVIES_API_KEY;

async function fetchMovies(path) {
  const url = `${baseUrl + path}${
    path.includes('?') ? '&' : '?'
  }api_key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new AppError('Movies API error', response.status);
  }
  const data = await response.json();

  return data;
}

module.exports = { fetchMovies };
