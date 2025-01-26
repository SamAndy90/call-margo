'use client';

import { useEffect, useState, use } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { ChartBarIcon, CalendarIcon, PlusIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';
import CampaignCard from '@/components/growth-plan/CampaignCard';
import GrowthPlanActions from '@/components/growth-plan/GrowthPlanActions';
import Link from 'next/link';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];

const stages = [
  { name: 'Foundations', description: 'Build your marketing foundation', color: 'bg-coral/10 text-coral' },
  { name: 'Reach', description: 'Build brand awareness', color: 'bg-coral/10 text-coral' },
  { name: 'Engage', description: 'Create active engagement', color: 'bg-coral/10 text-coral' },
  { name: 'Convert', description: 'Turn prospects into customers', color: 'bg-coral/10 text-coral' },
  { name: 'Delight', description: 'Create loyal advocates', color: 'bg-coral/10 text-coral' },
];

export default async function GrowthPlanPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabaseToken = await cookieStore.get('sb-rlokeucsijkcsifjwurx-auth-token');

  const resolvedParams = {
    id: params.id
  };

  const [plan, setPlan] = useState<GrowthPlan | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>(supabaseToken?.value);

  useEffect(() => {
    fetchGrowthPlan();
    fetchCampaigns();
  }, [resolvedParams.id]);

  const fetchGrowthPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('growth_plans')
        .select('*')
        .eq('id', resolvedParams.id)
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
        .eq('growth_plan_id', resolvedParams.id)
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
    setError(null);
    try {
      console.log('Starting campaign creation with data:', newCampaign);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('User auth error:', userError);
        throw new Error('Authentication error. Please try logging in again.');
      }
      if (!userData.user) {
        throw new Error('No authenticated user found. Please log in.');
      }

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
        growth_plan_id: resolvedParams.id,
        user_id: userData.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Attempting to create campaign with structured data:', campaignData);

      const { data, error } = await supabase
        .from('campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(error.message || 'Failed to create campaign');
      }

      console.log('Campaign created successfully:', data);
      setCampaigns([data, ...campaigns]);
      setIsCreateModalOpen(false);
      setSelectedStage(null);
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error type:', typeof error);
      console.error('Error properties:', Object.getOwnPropertyNames(error));
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        setError(error.message);
      } else {
        setError('An unexpected error occurred while creating the campaign');
      }
    }
  };

  if (loading || !plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard/growth-plans"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Growth Plans
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <ChartBarIcon className="h-8 w-8 text-teal-600" />
                <h1 className="text-2xl font-semibold text-gray-900">{plan.name}</h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    plan.status === 'active'
                      ? 'bg-teal-50 text-teal-700'
                      : plan.status === 'archived'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-coral/10 text-coral'
                  }`}
                >
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setSelectedStage(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center rounded-md bg-coral px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                New Campaign
              </button>
              <GrowthPlanActions growthPlan={plan} onUpdate={fetchGrowthPlan} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {plan.start_date ? new Date(plan.start_date).toLocaleDateString() : 'Not set'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {plan.end_date ? new Date(plan.end_date).toLocaleDateString() : 'Not set'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Campaigns</dt>
                    <dd className="mt-1 text-sm text-gray-900">{campaigns.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {stages.map((stage) => {
            const stageCampaigns = campaigns.filter((c) => c.stage === stage.name);
            return (
              <div key={stage.name} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{stage.name}</h2>
                    <p className="text-sm text-gray-500">{stage.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStage(stage.name);
                      setIsCreateModalOpen(true);
                    }}
                    className="inline-flex items-center rounded-md bg-coral/10 px-3 py-2 text-sm font-semibold text-coral hover:bg-coral/20"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Add Campaign
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stageCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                  {stageCampaigns.length === 0 && (
                    <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-4">
                      <p className="text-center text-sm text-gray-500">
                        No campaigns in this stage yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <CreateCampaignModal
          open={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedStage(null);
          }}
          onCreate={handleCreateCampaign}
          defaultStage={selectedStage}
        />
      </div>
    </div>
  );
}
