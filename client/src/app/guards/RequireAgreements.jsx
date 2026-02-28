import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  AGREEMENTS_VERSION,
  getAgreementsState,
} from '@/shared/utils/userState';

const RequireAgreements = () => {
  const location = useLocation();
  const agreements = getAgreementsState();
  const hasAgreed =
    agreements?.accepted === true && agreements?.version === AGREEMENTS_VERSION;

  if (!hasAgreed) {
    return <Navigate to="/agreements" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAgreements;
