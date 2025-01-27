'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await signUp(email, password);
      setMessage('Check your email to confirm your account.');
    } catch {
      setMessage('Error creating account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
<<<<<<< HEAD
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/signin" className="font-medium text-coral hover:text-coral/90">
            sign in to your account
          </Link>
        </p>
=======
>>>>>>> ui27
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
<<<<<<< HEAD
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
=======
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
>>>>>>> ui27
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                />
              </div>
            </div>

            <div>
<<<<<<< HEAD
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
=======
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
>>>>>>> ui27
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                />
              </div>
            </div>

<<<<<<< HEAD
            {message && (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">{message}</p>
                  </div>
                </div>
              </div>
            )}

=======
>>>>>>> ui27
            <div>
              <button
                type="submit"
                disabled={isLoading}
<<<<<<< HEAD
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coral hover:bg-coral/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral disabled:opacity-50"
=======
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coral hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral disabled:opacity-50"
>>>>>>> ui27
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
<<<<<<< HEAD
=======

          {message && (
            <div className="mt-6">
              <p className="text-sm text-center text-gray-600">{message}</p>
            </div>
          )}
>>>>>>> ui27
        </div>
      </div>
    </div>
  );
}
