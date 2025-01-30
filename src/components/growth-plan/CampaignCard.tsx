import { Fragment } from 'react';
import { Campaign } from '@/types/types';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import clsx from 'clsx';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (campaignId: string) => void;
  onEdit: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onDelete, onEdit }: CampaignCardProps) {
  // Add safety check for campaign
  if (!campaign || !campaign.id) {
    console.warn('Campaign or campaign.id is undefined');
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <Link href={`/dashboard/campaigns/${campaign.id}`} className="block">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {campaign.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 truncate">
                {campaign.description || 'No description'}
              </p>
            </div>
            <Menu as="div" className="relative ml-4 flex-shrink-0">
              <Menu.Button className="flex items-center text-gray-400 hover:text-gray-500 focus:outline-none">
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(campaign);
                        }}
                        className={clsx(
                          active ? 'bg-gray-100' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(campaign.id);
                        }}
                        className={clsx(
                          active ? 'bg-gray-100' : '',
                          'block w-full text-left px-4 py-2 text-sm text-red-600'
                        )}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500">
              {campaign.start_date && (
                <p>
                  Start: {formatDate(campaign.start_date)}
                </p>
              )}
              {campaign.end_date && (
                <p>
                  End: {formatDate(campaign.end_date)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {campaign.distribution_channels?.map((channel: string) => (
                <span
                  key={channel}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
