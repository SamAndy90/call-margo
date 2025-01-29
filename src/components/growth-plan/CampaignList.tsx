'use client';

import { useState } from 'react';
import { Campaign } from '@/types/types';
import CampaignCard from './CampaignCard';
import { Squares2X2Icon as ViewGridIcon, ListBulletIcon as ViewListIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface CampaignListProps {
  campaigns: Campaign[];
  onDelete: (campaignId: string) => void;
  onEdit: (campaign: Campaign) => void;
}

export default function CampaignList({ campaigns, onDelete, onEdit }: CampaignListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className="flex justify-end mb-4">
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
            <ViewGridIcon className="h-5 w-5" aria-hidden="true" />
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
            <ViewListIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </span>
      </div>

      <div
        className={clsx(
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
        )}
      >
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
