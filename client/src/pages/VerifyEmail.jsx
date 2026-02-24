import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resendVerification, verifyEmail } from '../features/auth/api/authApi';
import { useModal } from '../context/ModalContext';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const token = searchParams.get('token');
  const storedPendingEmail =
    localStorage.getItem('pendingVerificationEmail') || '';
  const initialEmail = searchParams.get('email') || storedPendingEmail || '';

  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState(initialEmail ? 'info' : 'idle');
  const [message, setMessage] = useState(
    initialEmail
      ? 'Verification link sent, please check your email.'
      : ''
  );
  const [resendLoading, setResendLoading] = useState(false);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (!token || hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    setStatus('verifying');
    setMessage('Verifying your email...');

    verifyEmail(token, initialEmail)
      .then((data) => {
        setStatus('success');
        const apiMessage = data?.message || '';
        if (apiMessage.toLowerCase().includes('already verified')) {
          setMessage('Email already verified.');
        } else {
          setMessage(apiMessage || 'Email verified. You can log in now.');
        }

        if (data?.user && data?.token) {
          localStorage.setItem('userInfo', JSON.stringify(data));
          window.dispatchEvent(new Event('userInfoUpdated'));
          localStorage.removeItem('pendingVerificationEmail');
          localStorage.setItem('openUserModal', '1');
          window.dispatchEvent(new Event('openUserModal'));
          navigate('/');
          setTimeout(() => openModal('user'), 0);
        }
      })
      .catch((err) => {
        setStatus('error');
        const rawMessage = err?.message || 'Verification failed.';
        if (rawMessage.toLowerCase().includes('invalid or expired token')) {
          setMessage(
            'This link is no longer valid. If you already verified your email, you can log in. Otherwise, resend a new verification email.'
          );
        } else {
          setMessage(rawMessage);
        }
      });
  }, [token]);

  const handleResend = async (event) => {
    event.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email to resend the verification.');
      return;
    }

    setResendLoading(true);
    try {
      const data = await resendVerification(email);
      setStatus('success');
      setMessage(data?.message || 'Verification email sent.');
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Unable to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-accent-secondary bg-primary/90 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-primary">Verify your email</h1>

        {message && (
          <div
            className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
              status === 'success'
                ? 'border-green-500/50 text-green-400'
                : status === 'error'
                  ? 'border-red-500/50 text-red-400'
                  : 'border-accent-secondary text-secondary'
            }`}
          >
            {message}
          </div>
        )}

        {status === 'success' && (
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 w-full rounded-2xl bg-accent-secondary py-3 font-semibold text-accent hover:bg-accent-hover transition"
          >
            Back to home
          </button>
        )}

        <form onSubmit={handleResend} className="mt-8 space-y-4">
          <p className="text-sm text-secondary">
            Didn&apos;t get the email? You can resend it below.
          </p>
          <label className="text-sm text-primary block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-accent-secondary px-4 py-3 text-primary"
            required
          />
          <button
            disabled={resendLoading}
            className={`w-full rounded-2xl py-3 font-semibold text-accent transition ${
              resendLoading
                ? 'cursor-not-allowed bg-accent-secondary/60'
                : 'bg-accent-secondary hover:bg-accent-hover'
            }`}
          >
            {resendLoading ? 'Sending...' : 'Resend email again?'}
          </button>
        </form>
      </div>
    </div>
  );
}
