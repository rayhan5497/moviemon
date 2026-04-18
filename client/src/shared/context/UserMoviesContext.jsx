import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredUserInfo, isAdminUser } from '@/shared/utils/authStorage';

const UserMoviesContext = createContext(null);

export function UserMoviesProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => getStoredUserInfo());

  useEffect(() => {
    const handleUserInfoUpdated = () => {
      setUserInfo(getStoredUserInfo());
    };

    window.addEventListener('userInfoUpdated', handleUserInfoUpdated);
    return () =>
      window.removeEventListener('userInfoUpdated', handleUserInfoUpdated);
  }, []);

  const value = useMemo(
    () => ({
      userInfo,
      isLoggedIn: !!userInfo,
      isAdmin: isAdminUser(userInfo),
    }),
    [userInfo]
  );

  return (
    <UserMoviesContext.Provider value={value}>
      {children}
    </UserMoviesContext.Provider>
  );
}

export function useUserMoviesContext() {
  const context = useContext(UserMoviesContext);
  if (!context) {
    throw new Error(
      'useUserMoviesContext must be used within UserMoviesProvider'
    );
  }
  return context;
}
