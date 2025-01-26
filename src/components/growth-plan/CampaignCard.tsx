'use client';

import { CalendarIcon, ClockIcon, ShareIcon, ChartBarIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { Database } from '@/types/supabase';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface CampaignCardProps {
  campaign: Campaign;
}

const formatFrequency = (frequency: string | null) => {
  if (!frequency) return 'Not set';
  
  const frequencyMap: { [key: string]: string } = {
    'annually': 'Annual',
    'quarterly': 'Quarterly',
    'monthly': 'Monthly',
    '2x-month': 'Twice Monthly',
    'weekly': 'Weekly',
    'biweekly': 'Every Other Week',
    'daily': 'Daily',
    'custom': 'Custom'
  };

  return frequencyMap[frequency] || frequency;
};

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [tactic, setTactic] = useState<any>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (campaign.tactic_id) {
      fetchTactic();
    }
  }, [campaign.tactic_id]);

  const fetchTactic = async () => {
    try {
      const { data, error } = await supabase
        .from('tactics')
        .select('*')
        .eq('id', campaign.tactic_id)
        .single();

      if (error) throw error;
      setTactic(data);
    } catch (error) {
      console.error('Error fetching tactic:', error);
    }
  };

  const getStageColor = (stage: string) => {
    return 'bg-coral/10 text-coral';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-teal-50 text-teal-700';
      case 'draft':
        return 'bg-gray-50 text-gray-700';
      case 'completed':
        return 'bg-coral/10 text-coral';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className="relative block overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:border-teal-100 hover:ring-1 hover:ring-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              campaign.status
            )}`}
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
          <p className="text-sm font-medium text-coral">
            {campaign.custom_tactic || tactic?.name || 'No tactic selected'}
          </p>
        </div>
        <div className="mt-4">
          <h3 className="truncate text-lg font-medium text-gray-900">{campaign.name}</h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{campaign.description}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div className="flex items-center text-gray-500">
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
            {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not started'}
          </div>
          <div className="flex items-center text-gray-500">
            <ClockIcon className="mr-2 h-4 w-4 text-gray-400" />
            <span>
              {formatFrequency(campaign.frequency)}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <ShareIcon className="mr-2 h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {campaign.distribution_channels?.map((channel, index) => (
                <span
                  key={channel}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <UserGroupIcon className="mr-2 h-4 w-4 text-gray-400" />
            {campaign.target_audience_ids?.length || 0} Audiences
          </div>
        </div>
      </div>
    </Link>
  );
}
