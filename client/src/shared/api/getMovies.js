import filterAdult from '@/shared/utils/filterAdult';

const SEVER_URL = import.meta.env.VITE_SERVER_BASE_URL;
const BASE_URL = `${SEVER_URL}/api/movies`;

export async function getMovies(query, type) {
  let fullUrl;
  let fetchMulti = false;

  const [pathPart, ...queryParts] = query.split('&');

  let PathAndQuery = `${pathPart}?${queryParts.join('&')}`;

  if (type === 'discover/movie') {
    fullUrl = `${BASE_URL}/discover/movie?${query}`;
  } else if (type === 'discover/tv') {
    fullUrl = `${BASE_URL}/discover/tv?${query}`;
  } else if (type === 'movie') {
    fullUrl = `${BASE_URL}/movie/${PathAndQuery}`;
  } else if (type === 'tv') {
    fullUrl = `${BASE_URL}/tv/${PathAndQuery}`;
  } else if (type === 'similar/recommendations') {
    fullUrl = `${BASE_URL}/${PathAndQuery}`;
  } else if (type === 'person') {
    fullUrl = `${BASE_URL}/person/${PathAndQuery}`;
  } else if (type === 'search') {
    fullUrl = `${BASE_URL}/search/multi?${query}`;
  } else if (type === 'trending') {
    fullUrl = `${BASE_URL}/trending/${PathAndQuery}`;
  } else if (type === 'movie/tv') {
    fetchMulti = true;
    fullUrl = {
      movies: fetch(`${BASE_URL}/movie/${PathAndQuery}`),
      tvs: fetch(`${BASE_URL}/tv/${PathAndQuery}`),
    };
  } else if (type.split('/')[0] === 'player') {
    if (type.split('/')[1] === 'tv') {
      fullUrl = `${BASE_URL}/${PathAndQuery}`;
    } else {
      fullUrl = `${BASE_URL}/${PathAndQuery}`;
    }
  } else {
    throw new Error(`Route type "${type}" is not supported.`);
  }
  console.log('fullUrl', fullUrl);

  if (fetchMulti) {
    const entries = Object.entries(fullUrl);
    const responses = await Promise.all(entries.map(([, f]) => f));

    responses.forEach((res, i) => {
      if (!res.ok) {
        const [key] = entries[i];
        throw new Error(`API error for "${key}": ${res.status}`);
      }
    });

    const json = await Promise.all(responses.map((r) => r.json()));

    // re-construct object
    const data = Object.fromEntries(entries.map(([key], i) => [key, json[i]]));

    return await filterAdult(data);
  }

  const response = await fetch(fullUrl);
  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.status_message);
    err.code = data.status_code;
    throw err;
  }

  return filterAdult(data);
}

