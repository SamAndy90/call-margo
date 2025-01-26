import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Database } from '@/types/supabase';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

interface CreateGrowthPlanModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (plan: Partial<GrowthPlan>) => void;
}

export default function CreateGrowthPlanModal({
  open,
  onClose,
  onCreate,
}: CreateGrowthPlanModalProps) {
  // Set default dates for 90-day period starting tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ninetyDaysFromTomorrow = new Date(tomorrow);
  ninetyDaysFromTomorrow.setDate(tomorrow.getDate() + 90);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(formatDate(tomorrow));
  const [endDate, setEndDate] = useState(formatDate(ninetyDaysFromTomorrow));
  const [goals, setGoals] = useState<{ name: string }[]>([{ name: '' }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan: Partial<GrowthPlan> = {
      name,
      description,
      start_date: startDate || null,
      end_date: endDate || null,
      status: 'draft',
      goals: goals.filter(goal => goal.name.trim() !== ''),
      metrics: [],
    };

    onCreate(newPlan);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setStartDate(formatDate(tomorrow));
    setEndDate(formatDate(ninetyDaysFromTomorrow));
    setGoals([{ name: '' }]);
  };

  const addGoal = () => {
    setGoals([...goals, { name: '' }]);
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = { name: value };
    setGoals(newGoals);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      const newGoals = goals.filter((_, i) => i !== index);
      setGoals(newGoals);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d06e63] focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Create Growth Plan
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d06e63] focus:ring-[#d06e63] sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d06e63] focus:ring-[#d06e63] sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="startDate"
                              id="startDate"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d06e63] focus:ring-[#d06e63] sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="endDate"
                              id="endDate"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d06e63] focus:ring-[#d06e63] sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Goals</label>
                        <div className="mt-2 space-y-2">
                          {goals.map((goal, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={goal.name}
                                onChange={(e) => updateGoal(index, e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d06e63] focus:ring-[#d06e63] sm:text-sm"
                                placeholder="Enter a goal"
                              />
                              {goals.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeGoal(index)}
                                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d06e63] focus:ring-offset-2"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addGoal}
                          className="mt-2 inline-flex items-center text-sm font-medium text-[#d06e63] hover:text-[#b85c52]"
                        >
                          + Add Goal
                        </button>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-[#d06e63] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#b85c52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d06e63] sm:col-start-2"
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={onClose}
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
