'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import GrowthPlanClient from './GrowthPlanClient';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];
type Params = Promise<{ id: string }>;

export default function GrowthPlanPage({ params }: { params: Params }) {
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchData = useCallback(async () => {
    try {
      const { id } = await params;

      // Fetch growth plan
      const { data: plan, error: planError } = await supabase
        .from('growth_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (planError) throw planError;
      setGrowthPlan(plan);

      // Fetch campaigns
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('growth_plan_id', id)
        .order('created_at', { ascending: false });

      if (campaignError) throw campaignError;
      setCampaigns(campaignData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error: {error}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!growthPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Growth plan not found</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <GrowthPlanClient growthPlan={growthPlan} campaigns={campaigns} />;
}
