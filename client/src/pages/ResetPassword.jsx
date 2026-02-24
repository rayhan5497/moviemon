import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../features/auth/api/authApi';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setStatus('error');
      setMessage('Missing reset token.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const data = await resetPassword({ token, password });
      setStatus('success');
      setMessage(data?.message || 'Password reset successfully.');
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Unable to reset password.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-accent-secondary bg-primary/90 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-primary">Reset password</h1>
        <p className="text-secondary mt-2">Set a new password for your account.</p>

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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="text-sm text-primary block">New password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            className="w-full rounded-xl border border-accent-secondary px-4 py-3 text-primary"
          />

          <label className="text-sm text-primary block">Confirm password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-accent-secondary px-4 py-3 text-primary"
          />

          <button
            disabled={status === 'loading'}
            className={`w-full rounded-2xl py-3 font-semibold text-accent transition ${
              status === 'loading'
                ? 'cursor-not-allowed bg-accent-secondary/60'
                : 'bg-accent-secondary hover:bg-accent-hover'
            }`}
          >
            {status === 'loading' ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        {status === 'success' && (
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 w-full rounded-2xl border border-accent-secondary py-3 text-accent hover:bg-accent-secondary/20 transition"
          >
            Back to home
          </button>
        )}
      </div>
    </div>
  );
}
