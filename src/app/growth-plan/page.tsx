'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { PlusIcon } from '@heroicons/react/24/outline';
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
      const { data, error } = await supabase
        .from('growth_plans')
        .select('*')
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
      const { data, error } = await supabase
        .from('growth_plans')
        .insert([newPlan])
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Growth Plans</h1>
            <p className="mt-2 text-lg text-gray-600">
              Create and manage your marketing growth plans
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Plan
          </button>
        </div>

        {growthPlans.length === 0 ? (
          <div className="mt-8 text-center">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12">
              <p className="text-sm text-gray-500">No growth plans created yet.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-500"
              >
                Create your first growth plan
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {growthPlans.map((plan) => (
              <GrowthPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>

      <CreateGrowthPlanModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateGrowthPlan}
      />
    </div>
  );
}
