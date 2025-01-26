import { Database } from '@/types/supabase';
import { CalendarIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'foundations':
        return 'bg-purple-100 text-purple-800';
      case 'reach':
        return 'bg-blue-100 text-blue-800';
      case 'engage':
        return 'bg-green-100 text-green-800';
      case 'convert':
        return 'bg-yellow-100 text-yellow-800';
      case 'delight':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/campaign/${campaign.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-200 ease-in-out hover:shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              campaign.status
            )}`}
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {campaign.description || 'No description provided'}
        </p>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          {campaign.start_date && (
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>
                {new Date(campaign.start_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {campaign.target_audience_ids && campaign.target_audience_ids.length > 0 && (
            <div className="flex items-center">
              <UserGroupIcon className="mr-1 h-4 w-4" />
              <span>{campaign.target_audience_ids.length} Audiences</span>
            </div>
          )}
          {campaign.metrics && (
            <div className="flex items-center">
              <ChartBarIcon className="mr-1 h-4 w-4" />
              <span>{(campaign.metrics as any[]).length} Metrics</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          {campaign.channels && (campaign.channels as any[]).slice(0, 2).map((channel: any, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
            >
              {channel.name}
            </span>
          ))}
          {campaign.channels && (campaign.channels as any[]).length > 2 && (
            <span className="text-xs text-gray-500">
              +{(campaign.channels as any[]).length - 2} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
