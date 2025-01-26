'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';
import { Session } from '@supabase/supabase-js';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];

const stages = [
  { name: 'Attract', description: 'Bring in new users', color: 'bg-blue-50 text-blue-700' },
  { name: 'Engage', description: 'Keep users active', color: 'bg-green-50 text-green-700' },
  { name: 'Retain', description: 'Prevent churn', color: 'bg-yellow-50 text-yellow-700' },
  { name: 'Delight', description: 'Create loyal advocates', color: 'bg-coral/10 text-coral' },
];

interface GrowthPlanClientProps {
  planId: string;
  initialSession: Session;
}

export default function GrowthPlanClient({ planId, initialSession }: GrowthPlanClientProps) {
  const [plan, setPlan] = useState<GrowthPlan | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      setError(null);

      Promise.all([
        supabase.from('growth_plans').select('*').eq('id', planId).single(),
        supabase.from('campaigns').select('*').eq('growth_plan_id', planId).order('created_at', { ascending: false })
      ])
      .then(([planResult, campaignsResult]) => {
        if (planResult.error) throw planResult.error;
        if (campaignsResult.error) throw campaignsResult.error;
        
        setPlan(planResult.data);
        setCampaigns(campaignsResult.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
    };

    fetchData();
  }, [planId, supabase]);

  const handleCreateCampaign = (newCampaign: Partial<Campaign>) => {
    setError(null);

    const campaignData = {
      name: newCampaign.name,
      description: newCampaign.description,
      stage: newCampaign.stage,
      tactic_id: newCampaign.tactic_id,
      custom_tactic: newCampaign.custom_tactic,
      start_date: newCampaign.start_date,
      end_date: newCampaign.end_date,
      status: 'draft',
      frequency: newCampaign.frequency,
      distribution_channels: newCampaign.distribution_channels,
      growth_plan_id: planId,
      user_id: initialSession.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        setCampaigns(prev => [data, ...prev]);
        setIsCreateModalOpen(false);
        setSelectedStage(null);
      })
      .catch(error => {
        console.error('Error creating campaign:', error);
        setError(error.message);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!plan) return <div>Growth plan not found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{plan.name}</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          Add Campaign
        </button>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <div key={stage.name} className="relative">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">{stage.name}</h2>
                <p className="text-sm text-gray-500">{stage.description}</p>
                <button
                  onClick={() => {
                    setSelectedStage(stage.name);
                    setIsCreateModalOpen(true);
                  }}
                  className="mt-2 inline-flex items-center text-sm font-medium text-coral hover:text-coral/90"
                >
                  Add campaign
                </button>
              </div>

              <div className="space-y-4">
                {campaigns
                  .filter((campaign) => campaign.stage === stage.name)
                  .map((campaign) => (
                    <div
                      key={campaign.id}
                      className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-coral">
                            {campaign.custom_tactic || 'No tactic selected'}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              campaign.status === 'active'
                                ? 'bg-teal-50 text-teal-700'
                                : campaign.status === 'archived'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-coral/10 text-coral'
                            }`}
                          >
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">{campaign.name}</h3>
                        {campaign.description && (
                          <p className="mt-1 text-sm text-gray-500">{campaign.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateCampaignModal
        open={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
        onCreate={handleCreateCampaign}
        defaultStage={selectedStage}
      />
    </div>
  );
}
