'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get default dates (tomorrow and 90 days from tomorrow)
function getDefaultDates() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const endDate = new Date(tomorrow);
  endDate.setDate(endDate.getDate() + 90);
  
  return {
    start: formatDate(tomorrow),
    end: formatDate(endDate)
  };
}

export default function NewGrowthPlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const defaultDates = getDefaultDates();
  const [userId, setUserId] = useState<string | null>(null);
  const [company, setCompany] = useState<string | null>(null);

  useEffect(() => {
    async function getUserData() {
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error fetching user:', authError);
        router.push('/signin');
        return;
      }

      // Get user profile with company
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setError('Unable to create growth plan: Error fetching user profile');
        return;
      }

      if (!profile?.company) {
        setError('Unable to create growth plan: No company associated with user. Please update your profile first.');
        return;
      }

      setUserId(user.id);
      setCompany(profile.company);
    }
    getUserData();
  }, [supabase, router]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft',
    start_date: defaultDates.start,
    end_date: defaultDates.end
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!userId || !company) {
      setError('User or company information not available');
      setIsLoading(false);
      return;
    }

    try {
      const now = new Date().toISOString();
      const { data, error: insertError } = await supabase
        .from('growth_plans')
        .insert([{
          ...formData,
          user_id: userId,
          company: company,
          progress_percentage: 0,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('Failed to create growth plan');

      router.push(`/dashboard/growth-plan/${data.id}`);
    } catch (err) {
      console.error('Error creating growth plan:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create growth plan');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Create New Growth Plan</h1>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm p-2"
            placeholder="Enter growth plan name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm p-3"
            placeholder="Describe your growth plan objectives and goals"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            id="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm p-2"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm p-2"
            />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 italic bg-gray-50 p-4 rounded-md">
          90-Day plans give you time to test if it&apos;s working. You can always update things based on how it&apos;s working.
        </p>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-coral/90 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Growth Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}
