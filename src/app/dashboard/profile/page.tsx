'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { user } = useUser();
  const { profile, updateProfile, isLoading } = useProfile(user?.id);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company: profile?.company || '',
    role: profile?.role || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-500">
            Update your profile information and preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 divide-y divide-gray-200">
        <div className="space-y-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="role"
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-coral py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
