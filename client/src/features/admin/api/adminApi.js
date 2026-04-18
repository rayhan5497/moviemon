import {
  getAuthToken,
  getStoredUserInfo,
} from '@/shared/utils/authStorage';

const apiBase = import.meta.env.VITE_SERVER_BASE_URL || '';

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage || 'Request failed');
  }

  return data;
};

export const getAdminStats = async () => {
  const userInfo = getStoredUserInfo();
  const token = getAuthToken(userInfo);

  if (!token) {
    throw new Error('Missing auth token');
  }

  const response = await fetch(`${apiBase}/api/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response, 'Unable to load admin dashboard stats.');
};
