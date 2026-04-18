import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserMoviesContext } from '@/shared/context/UserMoviesContext';

const RequireAdmin = () => {
  const location = useLocation();
  const { userInfo, isAdmin } = useUserMoviesContext();

  if (!userInfo) {
    return <Navigate to="/user" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/user/account" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAdmin;
