'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Database } from '@/types/supabase';
import type { Project } from '@/types/types';
import {
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  TagIcon,
  CalendarIcon,
  SignalIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

type SimpleCampaign = {
  id: string;
  name: string;
};

interface ProjectDetailClientProps {
  projectId: string;
}

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [campaigns, setCampaigns] = useState<SimpleCampaign[]>([]);
  const [campaignName, setCampaignName] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        redirect('/login');
      }
      return session;
    };

    const fetchProject = async () => {
      try {
        setLoading(true);
        await checkAuth();

        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Project not found');

        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const session = await checkAuth();
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('id, name')
          .eq('user_id', session.user.id)
          .order('name');

        if (campaignsError) throw campaignsError;

        setCampaigns(campaignsData);

        const currentProject = await supabase
          .from('projects')
          .select('campaign_id')
          .eq('id', projectId)
          .single();

        if (currentProject.data?.campaign_id) {
          const campaign = campaignsData.find(c => c.id === currentProject.data.campaign_id);
          setCampaignName(campaign?.name || null);
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      }
    };

    fetchProject();
    fetchCampaigns();
  }, [projectId, supabase]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (updateError) throw updateError;

      window.location.href = pathname + '?' + searchParams.toString();
    } catch (err) {
      console.error('Error updating project status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update project status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (deleteError) throw deleteError;

      window.location.href = '/dashboard/projects';
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignChange = async (campaignId: string | null) => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        campaign_id: campaignId === '' ? null : campaignId,
      };

      const { error: updateError } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase error:', updateError);
        throw new Error(updateError.message);
      }

      // Update local campaign name
      if (campaignId) {
        const campaign = campaigns.find(c => c.id === campaignId);
        setCampaignName(campaign?.name || null);
      } else {
        setCampaignName(null);
      }

      // Refresh the page to get updated data
      window.location.href = pathname + '?' + searchParams.toString();
    } catch (err) {
      console.error('Error updating project campaign:', err);
      setError(err instanceof Error ? err.message : 'Failed to update project campaign');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coral"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Created {format(new Date(project.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-md bg-red-50">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Project Info */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Description</h2>
                  <p className="mt-2 text-gray-600">{project.description || 'No description provided.'}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Details</h2>
                  <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        Due Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {project.end_date
                          ? format(new Date(project.end_date), 'MMM d, yyyy')
                          : 'No due date set'}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <SignalIcon className="w-5 h-5 mr-2" />
                        Priority
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            project.priority
                          )}`}
                        >
                          {project.priority}
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <FlagIcon className="w-5 h-5 mr-2" />
                        Campaign
                      </dt>
                      <dd className="mt-1">
                        {isEditing ? (
                          <select
                            value={project.campaign_id || ''}
                            onChange={(e) => handleCampaignChange(e.target.value || null)}
                            disabled={loading}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                          >
                            <option value="">No Campaign</option>
                            {campaigns.map((campaign) => (
                              <option key={campaign.id} value={campaign.id}>
                                {campaign.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-gray-900">
                            {campaignName || 'No Campaign'}
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        <div className="flex items-center">
                          <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                          Tags
                        </div>
                      </dt>
                      <dd className="mt-1">
                        <div className="flex flex-wrap gap-2">
                          No tags
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Status Column */}
              <div className="ml-6 w-64">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
                <div className="space-y-2">
                  {['todo', 'in_progress', 'in_review', 'done', 'backlog', 'archived'].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={loading || project.status === status}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
                          project.status === status
                            ? 'bg-coral text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500 capitalize`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
