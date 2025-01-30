'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import type { Project, ProjectStatus, ProjectPriority } from '@/types/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  name: string;
}

interface CreateProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
  onProjectCreated: (project: Project) => void;
}

export default function CreateProjectModal({
  open,
  setOpen,
  user,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('todo');
  const [priority, setPriority] = useState<ProjectPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

      setCampaigns(data);
    };

    fetchCampaigns();
  }, [supabase, user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newProject: Database['public']['Tables']['projects']['Insert'] = {
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        status,
        priority,
        end_date: dueDate || null,
        campaign_id: campaignId,
      };

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert([newProject])
        .select('*')
        .single();

      if (insertError) {
        console.error('Supabase error:', insertError);
        throw new Error(insertError.message);
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      onProjectCreated(data);
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setDueDate('');
    setCampaignId(null);
    setError(null);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Create New Project
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      {error && (
                        <div className="rounded-md bg-red-50 p-4">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      )}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="campaign" className="block text-sm font-medium text-gray-700">
                          Campaign (Optional)
                        </label>
                        <select
                          id="campaign"
                          name="campaign"
                          value={campaignId || ''}
                          onChange={(e) => setCampaignId(e.target.value || null)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                        >
                          <option value="">No Campaign</option>
                          {campaigns.map((campaign) => (
                            <option key={campaign.id} value={campaign.id}>
                              {campaign.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="done">Done</option>
                            <option value="backlog">Backlog</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                            Priority
                          </label>
                          <select
                            id="priority"
                            name="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          id="dueDate"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                        />
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex w-full justify-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral-500 sm:ml-3 sm:w-auto"
                        >
                          {loading ? 'Creating...' : 'Create Project'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
