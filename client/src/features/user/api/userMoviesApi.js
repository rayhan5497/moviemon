const API_BASE = import.meta.env.VITE_TMDB_PROXY_URL || '';

const getAuthHeaders = () => {
  const stored = localStorage.getItem('userInfo');
  if (!stored) return {};
  try {
    const token = JSON.parse(stored)?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

export const getSavedMovies = async () => {
  const res = await fetch(`${API_BASE}/api/user/saved`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch saved movies');
  const data = await res.json();
  return data.saved; // { movies: [], tv: [] }
};

export const getWatchLaterMovies = async () => {
  const res = await fetch(`${API_BASE}/api/user/watchlater`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch watch later movies');
  const data = await res.json();
  return data.watchLater; // { movies: [], tv: [] }
};

export const getWatchHistory = async () => {
  const res = await fetch(`${API_BASE}/api/user/watch-history`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch watch history');
  const data = await res.json();
  return data.watchHistory || [];
};

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export const saveWatchHistory = async (payload) => {
  const res = await fetch(
    `${API_BASE}/api/user/watch-history/${payload.mediaId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const data = await safeJson(res);
    const message =
      data?.message || data?.error || 'Failed to save watch history';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  const data = await res.json();
  return data.watchHistory || [];
};
