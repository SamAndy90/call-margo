'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Campaign } from '@/types/types';
import { Database } from '@/types/supabase';
import { PlusIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';
import clsx from 'clsx';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
type CampaignWithGrowthPlan = Campaign & { growth_plan: GrowthPlan | null };

export default function CampaignsClient() {
  const [campaigns, setCampaigns] = useState<CampaignWithGrowthPlan[]>([]);
  const [growthPlans, setGrowthPlans] = useState<GrowthPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchGrowthPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('growth_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGrowthPlans(data || []);
    } catch (err) {
      console.error('Error fetching growth plans:', err);
      setError(err instanceof Error ? err.message : 'Error fetching growth plans');
    }
  }, [supabase]);

  const fetchCampaigns = useCallback(async () => {
    try {
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          growth_plan:growth_plan_id (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedPlan !== 'all') {
        query = query.eq('growth_plan_id', selectedPlan);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedPlan]);

  useEffect(() => {
    fetchGrowthPlans();
  }, [fetchGrowthPlans]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns, selectedPlan]);

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError(err instanceof Error ? err.message : 'Error deleting campaign');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
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

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your marketing campaigns
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-coral hover:bg-coral/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-coral focus:border-coral sm:text-sm rounded-md"
            >
              <option value="all">All Growth Plans</option>
              {growthPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <span className="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
                  viewMode === 'grid'
                    ? 'bg-coral text-white hover:bg-coral/90'
                    : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
                )}
              >
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={clsx(
                  'relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10',
                  viewMode === 'list'
                    ? 'bg-coral text-white hover:bg-coral/90'
                    : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
                )}
              >
                <ListBulletIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
          </div>
        </div>

        <div className="mt-4">
          {viewMode === 'list' ? (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <li key={campaign.id}>
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex text-sm">
                              <p className="font-medium text-coral">{campaign.name}</p>
                            </div>
                          </div>
                          <div className="ml-2 flex flex-shrink-0">
                            <span
                              className={clsx(
                                'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                campaign.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              )}
                            >
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Growth Plan: {campaign.growth_plan?.name || 'None'}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Created{' '}
                              {new Date(campaign.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
                  <div className="px-4 py-5 sm:px-6">
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="hover:text-coral"
                    >
                      <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      Growth Plan: {campaign.growth_plan?.name || 'None'}
                    </p>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteCampaign(campaign.id);
                        }}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateCampaignModal
        open={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
        onCampaignCreated={(newCampaign: Database['public']['Tables']['campaigns']['Row']) => {
          const campaignWithGrowthPlan: CampaignWithGrowthPlan = {
            ...newCampaign,
            growth_plan: null
          };

          setCampaigns(prevCampaigns => [...prevCampaigns, campaignWithGrowthPlan]);
        }}
        growthPlans={growthPlans}
      />
    </div>
  );
}
