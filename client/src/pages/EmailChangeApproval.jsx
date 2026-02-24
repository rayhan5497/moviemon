import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { approveEmailChange } from '../features/auth/api/authApi';

export default function EmailChangeApprovalPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing approval token.');
      return;
    }

    setStatus('loading');
    setMessage('Approving email change...');

    approveEmailChange(token)
      .then((data) => {
        setStatus('success');
        setMessage(data?.message || 'Email change approved.');
        if (data?.email) {
          const stored = localStorage.getItem('userInfo');
          if (stored) {
            const userInfo = JSON.parse(stored);
            const nextUserInfo = {
              ...userInfo,
              user: { ...userInfo.user, email: data.email },
            };
            localStorage.setItem('userInfo', JSON.stringify(nextUserInfo));
            window.dispatchEvent(new Event('userInfoUpdated'));
          }
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.message || 'Approval failed.');
      });
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-accent-secondary bg-primary/90 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-primary">Approve email change</h1>
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
      </div>
    </div>
  );
}
