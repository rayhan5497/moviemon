export {
  clearStoredUserInfo,
  getAuthToken,
  getStoredUserInfo,
  setStoredUserInfo,
} from '@/shared/utils/authStorage';

export const getApiBase = () => import.meta.env.VITE_SERVER_BASE_URL || '';
