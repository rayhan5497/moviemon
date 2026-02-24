import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { requestPasswordReset } from '../features/auth/api/authApi';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(presetEmail);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const data = await requestPasswordReset(email);
      setStatus('success');
      setMessage(data?.message || 'Reset link sent. Please check your email.');
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Unable to send reset email.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-accent-secondary bg-primary/90 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-primary">Forgot password</h1>
        <p className="text-secondary mt-2">
          Enter your email and we will send you a reset link.
        </p>

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
          <label className="text-sm text-primary block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
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
            {status === 'loading' ? 'Sending...' : 'Send reset link'}
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
