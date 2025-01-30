'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { profile, isLoading, error: profileError } = useProfile(user?.id);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to update your profile');
      return;
    }

    try {
      setError(null);
      setSuccess(false);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      alert('Profile updated successfully');
    } catch (err: unknown) {
      console.error('Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating profile';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (profileError) {
    return <div>Error loading profile: {profileError.message}</div>;
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-md">
          Profile updated successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            type="text"
            id="avatar_url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-coral px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}
