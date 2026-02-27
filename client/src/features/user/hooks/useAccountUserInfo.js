import { useEffect, useState } from 'react';
import { getStoredUserInfo } from '../utils/accountStorage';

export const useAccountUserInfo = () => {
  const [userInfo, setUserInfo] = useState(() => getStoredUserInfo());

  useEffect(() => {
    const handler = () => {
      setUserInfo(getStoredUserInfo());
    };
    window.addEventListener('userInfoUpdated', handler);
    return () => window.removeEventListener('userInfoUpdated', handler);
  }, []);

  return { userInfo, setUserInfo };
};

