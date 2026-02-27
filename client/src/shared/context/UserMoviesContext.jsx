import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserMoviesContext = createContext(null);

export function UserMoviesProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const handleUserInfoUpdated = () => {
      const stored = localStorage.getItem('userInfo');
      const nextUserInfo = stored ? JSON.parse(stored) : null;
      setUserInfo(nextUserInfo);
    };

    window.addEventListener('userInfoUpdated', handleUserInfoUpdated);
    return () =>
      window.removeEventListener('userInfoUpdated', handleUserInfoUpdated);
  }, []);

  const value = useMemo(
    () => ({
      userInfo,
      isLoggedIn: !!userInfo,
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
