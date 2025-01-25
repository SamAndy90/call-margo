'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface MarketerInfo {
  expertise: string[];
  yearsExperience: string;
}

interface BusinessInfo {
  companyName: string;
  industry: string;
}

type UserType = 'business' | 'marketer';
type SignupStep = 'account' | 'profile' | 'details';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<UserType>('business');
  const [currentStep, setCurrentStep] = useState<SignupStep>('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [marketerInfo, setMarketerInfo] = useState<MarketerInfo>({
    expertise: [],
    yearsExperience: '',
  });
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    companyName: '',
    industry: '',
  });
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (currentStep !== 'details') {
      moveToNextStep();
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setMessage('Error creating account. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const moveToNextStep = () => {
    if (currentStep === 'account') {
      if (!email || !password) {
        setMessage('Please fill in all fields');
        return;
      }
      if (password.length < 6) {
        setMessage('Password must be at least 6 characters');
        return;
      }
      setCurrentStep('profile');
    } else if (currentStep === 'profile') {
      if (!name) {
        setMessage('Please enter your name');
        return;
      }
      setCurrentStep('details');
    }
    setMessage('');
  };

  const handleExpertiseChange = (expertise: string) => {
    setMarketerInfo(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise],
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'account':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-coral"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-coral"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-coral"
                />
              </div>
            </div>
          </>
        );
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-coral"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">I am a...</label>
              <div className="mt-2 space-x-4">
                <button
                  type="button"
                  onClick={() => setUserType('business')}
                  className={`px-4 py-2 rounded-t-lg ${
                    userType === 'business'
                      ? 'bg-coral/10 text-coral border-b-2 border-coral'
                      : 'text-gray-600 hover:text-coral'
                  }`}
                >
                  Business Owner
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('marketer')}
                  className={`px-4 py-2 rounded-t-lg ${
                    userType === 'marketer'
                      ? 'bg-coral/10 text-coral border-b-2 border-coral'
                      : 'text-gray-600 hover:text-coral'
                  }`}
                >
                  Marketing Expert
                </button>
              </div>
            </div>
          </div>
        );
      case 'details':
        return userType === 'business' ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={businessInfo.companyName}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, companyName: e.target.value })
                }
                className="mt-1 block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-coral"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                id="industry"
                required
                value={businessInfo.industry}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, industry: e.target.value })
                }
                className="mt-1 block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-coral"
              >
                <option value="">Select an industry</option>
                <option value="tech">Technology</option>
                <option value="retail">Retail</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Areas of Expertise
              </label>
              <div className="mt-2 space-y-2">
                {[
                  'Social Media Marketing',
                  'Content Marketing',
                  'Email Marketing',
                  'SEO',
                  'PPC Advertising',
                  'Marketing Strategy',
                ].map((expertise) => (
                  <label key={expertise} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={marketerInfo.expertise.includes(expertise)}
                      onChange={() => handleExpertiseChange(expertise)}
                      className="rounded border-gray-300 text-coral focus:ring-coral"
                    />
                    <span className="ml-2 text-gray-700">{expertise}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <select
                id="experience"
                required
                value={marketerInfo.yearsExperience}
                onChange={(e) =>
                  setMarketerInfo({ ...marketerInfo, yearsExperience: e.target.value })
                }
                className="mt-1 block w-full rounded-t-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-coral"
              >
                <option value="">Select years of experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {currentStep === 'account' ? '1' : currentStep === 'profile' ? '2' : '3'} of 3
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {renderStep()}

          {message && <div className="text-red-500 text-sm text-center">{message}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center px-6 py-3 bg-coral/10 text-coral border-b-2 border-coral 
                rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all"
            >
              {loading ? 'Creating account...' : currentStep === 'details' ? 'Create account' : 'Next'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/signin" className="text-coral hover:text-coral/80">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
