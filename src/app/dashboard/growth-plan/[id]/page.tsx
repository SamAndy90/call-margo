'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import GrowthPlanClient from './GrowthPlanClient';
import { useParams, useRouter } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];

function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default function GrowthPlanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    // Redirect to the new growth plan page if 'new' is in the URL
    if (id === 'new') {
      router.replace('/dashboard/growth-plan/new');
      return;
    }
  }, [id, router]);

  const fetchData = useCallback(async () => {
    if (!id) {
      const msg = 'No growth plan ID provided';
      console.error(msg);
      setError(msg);
      setIsLoading(false);
      return;
    }

    if (id === 'new') {
      setIsLoading(false);
      return;
    }

    if (!isValidUUID(id)) {
      const msg = 'Invalid growth plan ID format';
      console.error(msg, { id });
      setError(msg);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch growth plan
      const { data: plan, error: planError, status, statusText } = await supabase
        .from('growth_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (planError) {
        console.error('Error fetching growth plan:', {
          error: planError,
          status,
          statusText,
          id
        });
        throw planError;
      }

      if (!plan) {
        const msg = `Growth plan with ID ${id} not found`;
        console.error(msg);
        setError(msg);
        setIsLoading(false);
        return;
      }

      setGrowthPlan(plan);

      // Fetch campaigns
      const { data: campaignData, error: campaignError, status: campaignStatus, statusText: campaignStatusText } = await supabase
        .from('campaigns')
        .select('*')
        .eq('growth_plan_id', id)
        .order('created_at', { ascending: false });

      if (campaignError) {
        console.error('Error fetching campaigns:', {
          error: campaignError,
          status: campaignStatus,
          statusText: campaignStatusText,
          growthPlanId: id
        });
        throw campaignError;
      }

      setCampaigns(campaignData || []);
    } catch (err) {
      console.error('Error fetching data:', {
        error: err,
        errorType: err instanceof PostgrestError ? 'PostgrestError' : err instanceof Error ? 'Error' : typeof err,
        id
      });
      
      if (err instanceof PostgrestError) {
        setError(`Database error: ${err.message}`);
      } else if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('An unexpected error occurred while fetching data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [supabase, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (id === 'new') {
    return null; // Will be redirected by the useEffect
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
      </div>
    );
  }

  if (!growthPlan) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Not Found</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>The requested growth plan could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <GrowthPlanClient growthPlan={growthPlan} campaigns={campaigns} />;
}
