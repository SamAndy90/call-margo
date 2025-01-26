import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import CampaignClient from './client';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Campaign',
  description: 'View and manage your campaign',
};

type Params = Promise<{ id: string }>;

export default async function CampaignPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/signin');
  }

  // Fetch campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (campaignError) {
    console.error('Error fetching campaign:', campaignError);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading campaign</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch tasks
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('campaign_id', id)
    .order('created_at', { ascending: false });

  if (tasksError) {
    console.error('Error fetching tasks:', tasksError);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading tasks</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Campaign not found</h3>
          </div>
        </div>
      </div>
    );
  }

  return <CampaignClient campaign={campaign} initialTasks={tasks || []} />;
}
