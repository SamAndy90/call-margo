'use client';

import { useCallback, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';
import GrowthJourney from '@/components/growth-plan/GrowthJourney';
import CampaignList from '@/components/growth-plan/CampaignList';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface GrowthPlanClientProps {
  growthPlan: GrowthPlan;
  campaigns: Campaign[];
}

export default function GrowthPlanClient({ growthPlan, campaigns: initialCampaigns }: GrowthPlanClientProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('foundation');
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const updateGrowthPlanProgress = useCallback(async () => {
    try {
      const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
      const totalCampaigns = campaigns.length;
      const progress = totalCampaigns > 0 ? Math.round((completedCampaigns / totalCampaigns) * 100) : 0;

      const { error: updateError } = await supabase
        .from('growth_plans')
        .update({ 
          progress_percentage: progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', growthPlan.id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating growth plan progress:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating progress');
    }
  }, [campaigns, growthPlan.id, supabase]);

  const handleUpdateCampaign = useCallback(async (campaign: Campaign) => {
    if (!editingCampaign) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .update(campaign)
        .eq('id', editingCampaign.id);

      if (error) throw error;

      // Refresh campaigns
      const { data: updatedCampaigns, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('growth_plan_id', growthPlan.id);

      if (fetchError) throw fetchError;

      setCampaigns(updatedCampaigns);
      setIsEditModalOpen(false);
      setEditingCampaign(null);
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating the campaign');
    }
  }, [supabase, editingCampaign, growthPlan.id]);

  const handleCreateCampaign = useCallback(async (campaign: Campaign) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          ...campaign,
          growth_plan_id: growthPlan.id,
          user_id: growthPlan.user_id
        });

      if (error) throw error;

      // Refresh campaigns
      const { data: newCampaigns, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('growth_plan_id', growthPlan.id);

      if (fetchError) throw fetchError;

      setCampaigns(newCampaigns);
      setIsCreateModalOpen(false);
      await updateGrowthPlanProgress();
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the campaign');
    }
  }, [supabase, growthPlan.id, growthPlan.user_id, updateGrowthPlanProgress]);

  const handleCreateFromStage = useCallback((stage: string) => {
    setSelectedStage(stage.toLowerCase());
    setIsCreateModalOpen(true);
  }, []);

  const handleEditCampaign = useCallback(async (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteCampaign = useCallback(async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) {
        console.error('Error deleting campaign:', error);
        return;
      }

      setCampaigns(campaigns.filter(c => c.id !== campaignId));
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the campaign');
    }
  }, [supabase, campaigns]);

  if (!growthPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-base font-semibold text-coral">404</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Growth Plan not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{growthPlan.name}</h1>
          <p className="mt-2 text-gray-600">{growthPlan.description}</p>
        </div>

        <GrowthJourney 
          campaigns={campaigns}
          onCreateCampaign={handleCreateFromStage}
        />

        <CampaignList
          campaigns={campaigns}
          onDelete={handleDeleteCampaign}
          onEdit={handleEditCampaign}
        />

        <CreateCampaignModal
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          onCampaignCreated={handleCreateCampaign}
          initialStage={selectedStage}
        />

        {editingCampaign && (
          <CreateCampaignModal
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            onCampaignCreated={handleUpdateCampaign}
            initialStage={editingCampaign.stage}
            initialData={editingCampaign}
          />
        )}
      </div>
    </div>
  );
}
