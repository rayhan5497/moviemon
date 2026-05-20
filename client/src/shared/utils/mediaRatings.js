function normalizeNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function getMediaRating(media, source = 'preferred') {
  const tmdbRating = normalizeNumber(media?.vote_average);
  const imdbRating = normalizeNumber(media?.imdb_rating);

  if (source === 'tmdb') {
    return tmdbRating;
  }

  if (source === 'imdb') {
    return imdbRating ?? tmdbRating;
  }

  return imdbRating ?? tmdbRating;
}

export function getMediaVoteCount(media, source = 'preferred') {
  const tmdbVoteCount = normalizeNumber(media?.vote_count);
  const imdbVoteCount = normalizeNumber(media?.imdb_vote_count);

  if (source === 'tmdb') {
    return tmdbVoteCount;
  }

  if (source === 'imdb') {
    return imdbVoteCount ?? tmdbVoteCount;
  }

  return imdbVoteCount ?? tmdbVoteCount;
}
