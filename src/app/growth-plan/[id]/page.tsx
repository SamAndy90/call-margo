'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { ChartBarIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';
import CampaignCard from '@/components/growth-plan/CampaignCard';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];

const stages = [
  { name: 'Foundations', description: 'Build your marketing foundation', color: 'bg-purple-100 text-purple-800' },
  { name: 'Reach', description: 'Build brand awareness', color: 'bg-blue-100 text-blue-800' },
  { name: 'Engage', description: 'Create active engagement', color: 'bg-green-100 text-green-800' },
  { name: 'Convert', description: 'Turn prospects into customers', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Delight', description: 'Create loyal advocates', color: 'bg-red-100 text-red-800' },
];

export default function GrowthPlanPage({ params }: { params: { id: string } }) {
  const [plan, setPlan] = useState<GrowthPlan | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchGrowthPlan();
    fetchCampaigns();
  }, [params.id]);

  const fetchGrowthPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('growth_plans')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setPlan(data);
    } catch (error) {
      console.error('Error fetching growth plan:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('growth_plan_id', params.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (newCampaign: Partial<Campaign>) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ ...newCampaign, growth_plan_id: params.id }])
        .select()
        .single();

      if (error) throw error;
      setCampaigns([data, ...campaigns]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  if (loading || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const campaignsByStage = stages.map(stage => ({
    ...stage,
    campaigns: campaigns.filter(c => c.stage === stage.name),
  }));

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{plan.name}</h1>
              <p className="mt-2 text-lg text-gray-600">{plan.description}</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Campaign
            </button>
          </div>

          {/* Plan Details */}
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            {plan.start_date && (
              <div className="flex items-center">
                <CalendarIcon className="mr-1.5 h-5 w-5" />
                <span>
                  {new Date(plan.start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <ChartBarIcon className="mr-1.5 h-5 w-5" />
              <span>{campaigns.length} Campaigns</span>
            </div>
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                plan.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Growth Stages */}
        <div className="space-y-8">
          {campaignsByStage.map((stage) => (
            <div key={stage.name} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{stage.name}</h2>
                  <p className="text-sm text-gray-500">{stage.description}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stage.color}`}
                >
                  {stage.campaigns.length} Campaigns
                </span>
              </div>

              {stage.campaigns.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-sm text-gray-500">No campaigns in this stage yet.</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-500"
                  >
                    Create a campaign
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stage.campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <CreateCampaignModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCampaign}
      />
    </div>
  );
}
