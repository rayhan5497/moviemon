import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AGREEMENTS_VERSION,
  getAgreementsState,
  saveAgreementsState,
} from '@/shared/utils/userState';

const Agreements = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Agreements - MovieMon';
    const existing = getAgreementsState();
    if (
      existing?.accepted === true &&
      existing?.version === AGREEMENTS_VERSION
    ) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    if (!privacyAccepted || !termsAccepted) {
      setError('Please agree to both documents to continue.');
      return;
    }

    saveAgreementsState({
      accepted: true,
      acceptedAt: new Date().toISOString(),
      version: AGREEMENTS_VERSION,
    });

    const target = location.state?.from?.pathname || '/';
    navigate(target, { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl bg-primary border border-accent-secondary rounded-xl p-6 shadow-accent">
        <h1 className="text-2xl font-semibold text-primary">Agreements</h1>
        <p className="text-secondary mt-2">
          To use MovieMon, please review and accept the following documents.
        </p>

        <div className="mt-6 space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
            />
            <span className="text-secondary">
              I agree to the{' '}
              <Link to="/privacy" className="text-link underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className="text-secondary">
              I agree to the{' '}
              <Link to="/terms" className="text-link underline">
                Terms of Use
              </Link>
              .
            </span>
          </label>
        </div>

        <div className="mt-6 text-sm text-secondary bg-secondary rounded-lg p-3">
          This project is provided for educational purposes only. Features may change or be removed at any time. Data
          may be reset or deleted without notice.
        </div>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        <button
          type="button"
          onClick={handleContinue}
          className="cursor-pointer mt-6 w-full py-2 rounded-lg bg-accent text-white font-semibold"
        >
          Agree and continue
        </button>
      </div>
    </div>
  );
};

export default Agreements;
