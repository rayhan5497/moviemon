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
