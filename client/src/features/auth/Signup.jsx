import { useState } from 'react';
import { registerUser } from './api/authApi';
import {
  AGREEMENTS_VERSION,
  saveAgreementsState,
} from '@/shared/utils/userState';
export default function Signup({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreementAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validate = () => {
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!form.agreementAccepted) {
      return 'You must accept the privacy policy and terms of use';
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
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        agreementAccepted: form.agreementAccepted,
      };
      const data = await registerUser(payload);
      saveAgreementsState({
        accepted: true,
        acceptedAt: new Date().toISOString(),
        version: AGREEMENTS_VERSION,
      });
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

        <div className="flex items-start gap-3">
          <input
            id="agreementAccepted"
            type="checkbox"
            name="agreementAccepted"
            checked={form.agreementAccepted}
            onChange={handleChange}
            className="mt-2"
          />
          <label htmlFor="agreementAccepted" className="text-secondary text-sm">
            I agree to the{' '}
            <a
              href="/privacy"
              className="text-link underline"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="/terms"
              className="text-link underline"
              target="_blank"
              rel="noreferrer"
            >
              Terms of Use
            </a>
            .
          </label>
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
