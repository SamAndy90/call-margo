'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import Link from 'next/link';
import {
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

type Campaign = Database['public']['Tables']['campaigns']['Row'] & {
  growth_plans: Database['public']['Tables']['growth_plans']['Row'] | null;
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('campaigns')
        .select('*, growth_plans(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <div className="flex items-center gap-3">
              <RocketLaunchIcon className="h-8 w-8 text-teal-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Plan, execute, and track your marketing campaigns to drive growth and engagement.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/campaign/new"
              className="inline-flex items-center rounded-md bg-coral px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Campaign
            </Link>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-lg bg-white shadow-sm border border-gray-200">
            <div className="text-center p-12">
              <RocketLaunchIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first campaign</p>
              <div className="mt-6">
                <Link
                  href="/campaign/new"
                  className="inline-flex items-center rounded-md bg-coral px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                >
                  <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  New Campaign
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaign/${campaign.id}`}
                className="relative block overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:border-teal-100 hover:ring-1 hover:ring-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-teal-50 text-teal-700'
                          : campaign.status === 'completed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                    {campaign.growth_plans && (
                      <span className="inline-flex items-center rounded-full bg-coral/10 px-2 py-1 text-xs font-medium text-coral">
                        <ArrowTrendingUpIcon className="mr-1 h-3 w-3" />
                        {campaign.growth_plans.name}
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="truncate text-lg font-medium text-gray-900">{campaign.name}</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{campaign.description}</p>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
                    <div className="flex items-center text-gray-500">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {campaign.start_date
                        ? new Date(campaign.start_date).toLocaleDateString()
                        : 'Not started'}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <UserGroupIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {campaign.target_audience_ids?.length || 0} Audiences
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
