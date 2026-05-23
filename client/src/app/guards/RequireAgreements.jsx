import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredUserInfo } from '@/shared/utils/authStorage';
import {
  AGREEMENTS_VERSION,
  getAgreementsState,
} from '@/shared/utils/userState';

const RequireAgreements = () => {
  const location = useLocation();
  const agreements = getAgreementsState();
  const userInfo = getStoredUserInfo();
  const userAgreed = userInfo?.user?.agreementAccepted === true;
  const hasAgreed =
    userAgreed ||
    (agreements?.accepted === true &&
      agreements?.version === AGREEMENTS_VERSION);

  if (!hasAgreed) {
    return <Navigate to="/agreements" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAgreements;
