'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

interface EditGrowthPlanModalProps {
  growthPlan: GrowthPlan;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdate: () => void;
}

export default function EditGrowthPlanModal({
  growthPlan,
  open,
  setOpen,
  onUpdate,
}: EditGrowthPlanModalProps) {
  const [name, setName] = useState(growthPlan.name);
  const [description, setDescription] = useState(growthPlan.description || '');
  const [startDate, setStartDate] = useState(growthPlan.start_date || '');
  const [endDate, setEndDate] = useState(growthPlan.end_date || '');
  const [status, setStatus] = useState(growthPlan.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Update end date when start date changes to maintain 90-day period
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    if (newStartDate) {
      const start = new Date(newStartDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 90);
      setEndDate(end.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
  };

  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { error } = await supabase
        .from('growth_plans')
        .update({
          name,
          description,
          start_date: startDate || null,
          end_date: endDate || null,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', growthPlan.id);

      if (error) throw error;

      onUpdate();
      setOpen(false);
    } catch (err) {
      console.error('Error updating growth plan:', err);
      setError('Failed to update growth plan. Please try again.');
    } finally {
      setSaving(false);
    }
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
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Edit Growth Plan
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      {error && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
                          <div className="text-sm text-red-700">{error}</div>
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
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
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
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Automatically set to 90 days from start date
                          </p>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex w-full justify-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
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
