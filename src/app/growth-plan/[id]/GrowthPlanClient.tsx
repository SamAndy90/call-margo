'use client';

import { useCallback, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import CampaignCard from '@/components/growth-plan/CampaignCard';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface GrowthPlanClientProps {
  growthPlan: GrowthPlan;
  campaigns: Campaign[];
}

export default function GrowthPlanClient({ growthPlan, campaigns: initialCampaigns }: GrowthPlanClientProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const handleCreateCampaign = useCallback(async (data: Partial<Campaign>) => {
    try {
      const { data: newCampaign, error: createError } = await supabase
        .from('campaigns')
        .insert([{
          ...data,
          growth_plan_id: growthPlan.id,
          status: 'active',
          stage: 'planning'
        }])
        .select()
        .single();

      if (createError) throw createError;

      setCampaigns((prev) => [...prev, newCampaign]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the campaign');
    }
  }, [supabase, growthPlan.id]);

  const handleDeleteCampaign = useCallback(async (campaignId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (deleteError) throw deleteError;

      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the campaign');
    }
  }, [supabase]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error: {error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {growthPlan.name}
            </h2>
            {growthPlan.description && (
              <p className="mt-2 text-sm text-gray-500">{growthPlan.description}</p>
            )}
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="ml-3 inline-flex items-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90"
            >
              Add Campaign
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDelete={() => handleDeleteCampaign(campaign.id)}
            />
          ))}
        </div>
      </div>

      <CreateCampaignModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
    </div>
  );
}
