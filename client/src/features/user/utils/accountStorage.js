const STORAGE_KEY = 'userInfo';

export const getStoredUserInfo = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setStoredUserInfo = (userInfo) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
  window.dispatchEvent(new Event('userInfoUpdated'));
};

export const clearStoredUserInfo = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('userInfoUpdated'));
};

export const getAuthToken = (userInfo) => userInfo?.token || null;

export const getApiBase = () => import.meta.env.VITE_SERVER_BASE_URL || '';
