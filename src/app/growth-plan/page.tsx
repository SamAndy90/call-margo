'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import GrowthPlanCard from '@/components/growth-plan/GrowthPlanCard';
import CreateGrowthPlanModal from '@/components/growth-plan/CreateGrowthPlanModal';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

export default function GrowthPlanPage() {
  const [growthPlans, setGrowthPlans] = useState<GrowthPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchGrowthPlans();
  }, []);

  const fetchGrowthPlans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('growth_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGrowthPlans(data || []);
    } catch (error) {
      console.error('Error fetching growth plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrowthPlan = async (newPlan: Partial<GrowthPlan>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('growth_plans')
        .insert([{ ...newPlan, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setGrowthPlans([data, ...growthPlans]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating growth plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="h-8 w-8 text-teal-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Growth Plans</h1>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Create and manage your marketing growth plans to drive success
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center rounded-md bg-coral px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Plan
            </button>
          </div>
        </div>

        {growthPlans.length === 0 ? (
          <div className="rounded-lg bg-white shadow-sm border border-gray-200">
            <div className="text-center p-12">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No growth plans</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first growth plan</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-coral px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                >
                  <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  New Plan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {growthPlans.map((plan) => (
              <GrowthPlanCard key={plan.id} plan={plan} onUpdate={fetchGrowthPlans} />
            ))}
          </div>
        )}

        <CreateGrowthPlanModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateGrowthPlan}
        />
      </div>
    </div>
  );
}
