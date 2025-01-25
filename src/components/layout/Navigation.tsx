'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="relative w-24 h-8">
              <Image
                src="/images/margo-logo.svg"
                alt="Margo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100px, 150px"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-coral">
                  Dashboard
                </Link>
                <Link href="/campaigns" className="text-gray-600 hover:text-coral">
                  Campaigns
                </Link>
                <Link href="/analytics" className="text-gray-600 hover:text-coral">
                  Analytics
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-coral/10 text-coral border-b-2 border-coral 
                    rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/features" className="text-gray-600 hover:text-coral">
                  Features
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-coral">
                  Pricing
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-coral">
                  About
                </Link>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 text-gray-600 hover:text-coral transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 bg-coral/10 text-coral border-b-2 border-coral 
                    rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-coral"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white border-b border-gray-100">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-600 hover:text-coral hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/campaigns"
                    className="block px-4 py-2 text-gray-600 hover:text-coral hover:bg-gray-50"
                  >
                    Campaigns
                  </Link>
                  <Link
                    href="/analytics"
                    className="block px-4 py-2 text-gray-600 hover:text-coral hover:bg-gray-50"
                  >
                    Analytics
                  </Link>
                  <div className="px-4 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 bg-coral/10 text-coral border-b-2 border-coral 
                        rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/features"
                    className="block px-4 py-2 text-gray-600 hover:text-coral hover:bg-gray-50"
                  >
                    Features
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-4 py-2 text-gray-600 hover:text-coral hover:bg-gray-50"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-gray-600 hover:text-coral hover:bg-gray-50"
                  >
                    About
                  </Link>
                  <div className="px-4 py-2 space-y-2">
                    <button
                      onClick={handleSignIn}
                      className="w-full px-4 py-2 text-gray-600 hover:text-coral transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleSignUp}
                      className="w-full px-4 py-2 bg-coral/10 text-coral border-b-2 border-coral 
                        rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
