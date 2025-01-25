'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
      setError('');
    } catch (error) {
      setError('Error sending reset password email');
      setMessage('');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-coral"
              placeholder="Email address"
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="text-green-500 text-sm text-center">{message}</div>}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center px-6 py-3 bg-coral/10 text-coral border-b-2 border-coral 
                rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all"
            >
              Send reset instructions
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/signin" className="text-coral hover:text-coral/80">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
