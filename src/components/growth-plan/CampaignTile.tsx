'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Campaign } from '@/types/types';
import { Menu } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface CampaignTileProps {
  campaign: Campaign;
  onCampaignUpdated: () => void;
}

export default function CampaignTile({ campaign, onCampaignUpdated }: CampaignTileProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id);

      if (error) throw error;
      onCampaignUpdated();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('No session found');

      const { error } = await supabase
        .from('campaigns')
        .insert([{
          user_id: campaign.user_id,
          name: `${campaign.name} (Copy)`,
          description: campaign.description,
          objective: campaign.objective,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          status: 'draft',
          stage: campaign.stage,
          frequency: campaign.frequency,
          created_by: session.session.user.id,
        }]);

      if (error) throw error;
      onCampaignUpdated();
    } catch (error) {
      console.error('Error duplicating campaign:', error);
      alert('Failed to duplicate campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral"
            disabled={loading}
          >
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/dashboard/campaigns/${campaign.id}`}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block px-4 py-2 text-sm`}
                  >
                    View Details
                  </Link>
                )}
              </Menu.Item>
              {campaign.status === 'draft' && (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDuplicate}
                        disabled={loading}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        Duplicate
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className={`${
                          active ? 'bg-gray-100 text-red-900' : 'text-red-700'
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </>
              )}
            </div>
          </Menu.Items>
        </Menu>
      </div>

      <Link href={`/dashboard/campaigns/${campaign.id}`} className="block">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {campaign.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {campaign.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500">Stage</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {campaign.stage || 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Frequency</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {campaign.frequency || 'Not set'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              campaign.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : campaign.status === 'completed'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {campaign.status}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {campaign.start_date && (
              <span>
                {new Date(campaign.start_date).toLocaleDateString()}
                {campaign.end_date && ' - '}
                {campaign.end_date && new Date(campaign.end_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
