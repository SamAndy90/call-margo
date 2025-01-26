'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { CalendarIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type Tactic = Database['public']['Tables']['tactics']['Row'];

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CampaignCard({ campaign, onEdit, onDelete }: CampaignCardProps) {
  const [tactic, setTactic] = useState<Tactic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchTactic = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tactics')
        .select('*')
        .eq('id', campaign.tactic_id)
        .single();

      if (error) throw error;
      setTactic(data);
    } catch (err) {
      console.error('Error fetching tactic:', err);
      setError(err instanceof Error ? err.message : 'Error fetching tactic');
    } finally {
      setLoading(false);
    }
  }, [supabase, campaign.tactic_id]);

  useEffect(() => {
    if (campaign.tactic_id) {
      fetchTactic();
    } else {
      setLoading(false);
    }
  }, [campaign.tactic_id, fetchTactic]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'draft':
        return 'bg-gray-50 text-gray-700';
      case 'completed':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-coral">
            {campaign.custom_tactic || tactic?.name || 'No tactic selected'}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              campaign.status
            )}`}
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{campaign.name}</h3>
        {campaign.description && (
          <p className="mt-1 text-sm text-gray-500">{campaign.description}</p>
        )}
        {(campaign.start_date || campaign.end_date) && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
            <p>
              {campaign.start_date && format(new Date(campaign.start_date), 'MMM d, yyyy')}
              {campaign.end_date && ' - '}
              {campaign.end_date && format(new Date(campaign.end_date), 'MMM d, yyyy')}
            </p>
          </div>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex divide-x divide-gray-200 border-t border-gray-200 bg-gray-50">
          {onEdit && (
            <button
              type="button"
              className="flex flex-1 items-center justify-center py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={onEdit}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="flex flex-1 items-center justify-center py-2 text-sm font-medium text-red-600 hover:bg-gray-100 hover:text-red-700"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
