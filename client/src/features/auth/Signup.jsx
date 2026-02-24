import { useState } from 'react';
import { registerUser } from './api/authApi';
export default function Signup({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(form);
      localStorage.setItem('pendingVerificationEmail', form.email);

      if (onSuccess) {
        onSuccess({
          message: data?.message || 'Check your email to verify your account.',
          action: 'register',
          email: form.email,
        });
      }
    } catch (err) {
      console.log('error:', err.message);
      setError(err.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wide">
          Movie<span className="text-accent">Mon</span>
        </h1>
        <p className="text-secondary text-sm mt-2">Create your account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="text-sm text-primary block mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-primary block mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary"
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

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-primary block mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={form.confirmPassword}
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
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </>
  );
}
