'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

interface CampaignDetailClientProps {
  campaignId: string;
}

export default function CampaignDetailClient({ campaignId }: CampaignDetailClientProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const fetchCampaign = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        redirect('/auth');
      }

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      if (!data) {
        redirect('/dashboard');
      }

      setCampaign(data);
      setEditedName(data.name);
      setEditedDescription(data.description || '');

      // Fetch associated growth plan
      if (data.growth_plan_id) {
        const { data: growthPlanData, error: growthPlanError } = await supabase
          .from('growth_plans')
          .select('*')
          .eq('id', data.growth_plan_id)
          .single();

        if (growthPlanError) throw growthPlanError;
        setGrowthPlan(growthPlanData);
      }
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError(err instanceof Error ? err.message : 'Error fetching campaign');
    } finally {
      setLoading(false);
    }
  }, [campaignId, supabase]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          name: editedName,
          description: editedDescription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', campaignId);

      if (error) throw error;

      setCampaign((prev) => 
        prev ? { ...prev, name: editedName, description: editedDescription } : null
      );
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(err instanceof Error ? err.message : 'Error updating campaign');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      router.push('/dashboard/campaigns');
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError(err instanceof Error ? err.message : 'Error deleting campaign');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
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

  if (!campaign) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-semibold text-gray-900 bg-white border-b border-gray-300 focus:border-coral focus:ring-0 px-0"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
          )}
          <p className="mt-2 text-sm text-gray-500">Campaign Details</p>
        </div>
        <div className="flex space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-coral hover:bg-coral/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(campaign.name);
                  setEditedDescription(campaign.description || '');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-coral hover:bg-coral/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral"
              >
                <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Edit Campaign
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Campaign Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and properties.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    campaign.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Growth Plan</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {growthPlan ? (
                  <Link 
                    href={`/dashboard/growth-plans/${growthPlan.id}`}
                    className="text-coral hover:text-coral/90"
                  >
                    {growthPlan.name}
                  </Link>
                ) : (
                  'No growth plan assigned'
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {isEditing ? (
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={4}
                    className="shadow-sm focus:ring-coral focus:border-coral block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                ) : (
                  campaign.description || 'No description'
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(campaign.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(campaign.updated_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
