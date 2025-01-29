'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import type { Campaign, GrowthPlan } from '@/types/types';
import GrowthPlanClient from './GrowthPlanClient';

function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default function GrowthPlanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const supabase = createClientComponentClient<Database>();
  
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || !isValidUUID(id)) {
      router.push('/dashboard');
      return;
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      }
    };

    checkSession();
  }, [id, router, supabase]);

  useEffect(() => {
    // Redirect to the new growth plan page if 'new' is in the URL
    if (id === 'new') {
      router.push('/dashboard/growth-plan/new');
      return;
    }

    if (!id || !isValidUUID(id)) {
      return;
    }

    const fetchGrowthPlan = async () => {
      setIsLoading(true);
      try {
        const { data: growthPlan, error: growthPlanError } = await supabase
          .from('growth_plans')
          .select('*')
          .eq('id', id)
          .single();

        if (growthPlanError) {
          throw growthPlanError;
        }

        if (!growthPlan) {
          router.push('/dashboard');
          return;
        }

        setGrowthPlan(growthPlan);

        const { data: campaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('growth_plan_id', id)
          .order('created_at', { ascending: false });

        if (campaignsError) {
          throw campaignsError;
        }

        setCampaigns(campaigns || []);
      } catch (error) {
        console.error('Error fetching growth plan:', error);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrowthPlan();
  }, [id, router, supabase]);

  if (isLoading || !growthPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-coral"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GrowthPlanClient growthPlan={growthPlan} campaigns={campaigns} />
    </div>
  );
}
