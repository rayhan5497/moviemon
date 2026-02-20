import { useState } from 'react';
import { useModal } from '../../context/ModalContext';

const apiBase = import.meta.env.VITE_TMDB_PROXY_URL;
export default function Login({ onSuccess }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { closeModal } = useModal();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      const userInfo = localStorage.getItem('userInfo');
      console.log('data', data);
      console.log('userInfo', JSON.parse(userInfo));
      window.dispatchEvent(new Event('userInfoUpdated'));
      if (onSuccess) {
        onSuccess('Logged in successfully');
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wide">
          Movie<span className="text-accent">Mon</span>
        </h1>
        <p className="text-secondary text-sm mt-2">
          Login to save your progress
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-sm text-primary block mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary "
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-primary block mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary"
            placeholder="••••••••"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Button */}
        <button
          disabled={loading}
          className={`w-full py-3 rounded-xl bg-accent-secondary hover:bg-accent-hover transition font-semibold text-accent disabled:opacity-60 ${
            loading ? 'cursor-not-allowed' : 'cursor-pointer'
          } `}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </>
  );
}
