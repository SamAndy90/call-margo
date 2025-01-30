'use client';

import { Campaign } from '@/types/types';
import { formatDate } from '@/lib/utils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface CampaignDetailProps {
  campaign: Campaign;
}

export default function CampaignDetail({ campaign }: CampaignDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            {campaign.description && (
              <p className="mt-2 text-gray-500">{campaign.description}</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Stage</dt>
                <dd className="mt-1 text-sm text-gray-900">{campaign.stage}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{campaign.status}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                <dd className="mt-1 text-sm text-gray-900">{campaign.frequency}</dd>
              </div>

              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Primary Tactic</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Not specified
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(campaign.start_date)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">End Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(campaign.end_date)}
                </dd>
              </div>

              {campaign.distribution_channels && campaign.distribution_channels.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Distribution Channels
                  </dt>
                  <dd className="mt-1">
                    <div className="flex flex-wrap gap-2">
                      {campaign.distribution_channels.map((channel: string) => (
                        <span
                          key={channel}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
