const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || '';

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export const fetchByType = async (type, id) => {
  const res = await fetch(`${API_BASE}/api/movies/${type}/${id}`);
  if (!res.ok) {
    const data = await safeJson(res);
    const message =
      data?.status_message || data?.message || `Failed to fetch ${type}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return { ...data, media_type: type };
};

export const fetchMediaById = async (id, mediaType) => {
  if (mediaType !== 'tv' && mediaType !== 'movie') {
    throw new Error('mediaType is required');
  }
  return fetchByType(mediaType, id);
};
