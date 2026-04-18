const STORAGE_KEY = 'userInfo';

export const getStoredUserInfo = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading user info:', error);
    return null;
  }
};

export const setStoredUserInfo = (userInfo) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
    window.dispatchEvent(new Event('userInfoUpdated'));
  } catch (error) {
    console.error('Error saving user info:', error);
  }
};

export const clearStoredUserInfo = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('userInfoUpdated'));
  } catch (error) {
    console.error('Error clearing user info:', error);
  }
};

export const getAuthToken = (userInfo) => userInfo?.token || null;

export const isAdminUser = (userInfo) => userInfo?.user?.role === 'admin';
