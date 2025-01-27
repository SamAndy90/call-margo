'use client';

import { useCallback, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

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

interface CampaignClientProps {
  campaign: Campaign;
  initialTasks: Task[];
}

export default function CampaignClient({ campaign, initialTasks }: CampaignClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const handleTaskCreate = useCallback(async (taskData: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, campaign_id: campaign.id }])
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) => [data, ...prev]);
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'Error creating task');
    }
  }, [campaign.id, supabase]);

  const handleTaskUpdate = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'Error updating task');
    }
  }, [supabase]);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err instanceof Error ? err.message : 'Error deleting task');
    }
  }, [supabase]);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error: {error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Link
          className="text-sm font-medium text-coral hover:text-coral-600"
          href={`/dashboard/growth-plan/${campaign.growth_plan_id}`}
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Growth Plan
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{campaign.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                campaign.status
              )}`}
            >
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
            <button
              type="button"
              onClick={() => handleTaskCreate({ name: 'New Task', description: '', status: 'draft' })}
              className="inline-flex items-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{task.name}</h3>
                <button
                  onClick={() => handleTaskDelete(task.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
              <div className="mt-4">
                <select
                  value={task.status}
                  onChange={(e) => handleTaskUpdate(task.id, { status: e.target.value })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-coral sm:text-sm sm:leading-6"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
