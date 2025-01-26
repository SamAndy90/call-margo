'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import {
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlusIcon,
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

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

export default function CampaignPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchCampaign();
    fetchProjects();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('campaign_id', params.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(campaign.end_date || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const progress = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    campaign.status
                  )}`}
                >
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>
              <p className="mt-2 text-lg text-gray-600">{campaign.description}</p>
            </div>
            <button
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Project
            </button>
          </div>

          {/* Campaign Details */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Time Remaining</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{daysLeft} days</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{Math.round(progress)}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Projects</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <UserGroupIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Target Audiences</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {campaign.target_audience_ids?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <p className="mt-2 text-sm text-gray-700">
                A list of all projects in this campaign including their name, status, and progress.
              </p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="mt-6 text-center">
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12">
                <p className="text-sm text-gray-500">No projects created yet.</p>
                <button className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-500">
                  Create your first project
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
              <ul role="list" className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li key={project.id}>
                    <div className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="truncate text-sm font-medium text-blue-600">
                            <Link href={`/project/${project.id}`}>{project.name}</Link>
                          </div>
                          <div className="ml-2 flex flex-shrink-0">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                project.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {project.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <CalendarIcon
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <p>
                              Due{' '}
                              <time dateTime={project.end_date || ''}>
                                {new Date(project.end_date || '').toLocaleDateString()}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
