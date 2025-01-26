'use client';

import { useEffect, useState, use } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import {
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlusIcon,
  CheckIcon,
  ClockIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import EditGrowthPlanModal from '@/components/growth-plan/EditGrowthPlanModal';

type Campaign = Database['public']['Tables']['campaigns']['Row'] & {
  growth_plans: Database['public']['Tables']['growth_plans']['Row'] | null;
};

interface Task {
  id: string;
  name: string;
  status: string;
  due_date?: string;
}

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

export default function CampaignPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editGrowthPlanOpen, setEditGrowthPlanOpen] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const campaignId = use(params).id;

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*, growth_plans(*)')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      setCampaign(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setLoading(false);
    }
  };

  if (loading || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Campaigns
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
              <p className="mt-2 text-sm text-gray-500">{campaign.description}</p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                campaign.status
              )}`}
            >
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {campaign.start_date
                        ? new Date(campaign.start_date).toLocaleDateString()
                        : 'Not set'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Objective</dt>
                    <dd className="mt-1 text-sm text-gray-900">{campaign.objective}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Target Audiences</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {campaign.target_audience_ids?.length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {campaign.growth_plans && (
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Growth Plan</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="flex items-center justify-between">
                          <span>{campaign.growth_plans.name}</span>
                          <button
                            onClick={() => setEditGrowthPlanOpen(true)}
                            className="ml-2 text-coral hover:text-coral/90"
                          >
                            Edit
                          </button>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {campaign.growth_plans && (
          <EditGrowthPlanModal
            growthPlan={campaign.growth_plans}
            open={editGrowthPlanOpen}
            setOpen={setEditGrowthPlanOpen}
            onUpdate={fetchCampaign}
          />
        )}

        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
              <p className="mt-2 text-sm text-gray-500">
                Track and manage tasks for this campaign
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                New Task
              </button>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="mt-6 text-center">
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <ClockIcon className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    New Task
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {task.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {task.due_date
                              ? new Date(task.due_date).toLocaleDateString()
                              : 'No due date'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
