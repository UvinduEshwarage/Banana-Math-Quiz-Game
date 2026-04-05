// D:\Sliit\ERP\Banana_Math Quiz\banana_math_quiz\app\set-password\SetPasswordForm.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const e = searchParams.get('email');
    const t = searchParams.get('token');

    if (!e || !t) {
      setError('Invalid password reset link.');
    }

    setEmail(e);
    setToken(t);
  }, [searchParams]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    if (!email || !token) {
      setError('Cannot set password. Missing email or token.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (res.ok) router.push('/login');
      else setError(data.message || 'Failed to set password.');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <form
        onSubmit={handleSetPassword}
        className="bg-white p-10 w-96 shadow-md text-gray-700"
      >
        <h1 className="text-xl mb-6 text-center font-irish">
          Set Your Password
        </h1>

        <p className="text-sm mb-4 text-center">
          Email: <strong>{email || 'N/A'}</strong>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-1 w-full rounded hover:bg-gray-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Setting Password...' : 'Set Password'}
        </button>
      </form>
    </div>
  );
}