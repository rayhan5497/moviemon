const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || '';

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

export const movieActionApi = async (
  movieId,
  actionType,
  state,
  mediaType
) => {
  const res = await fetch(`${API_BASE}/api/user/${actionType}/${movieId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      [actionType]: state,
      ...(mediaType ? { mediaType } : {}),
    }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Failed to ${actionType} movie`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};
