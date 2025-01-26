'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Database } from '@/types/supabase';
import TacticSelector from './TacticSelector';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type Tactic = Database['public']['Tables']['tactics']['Row'];

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (campaign: Partial<Campaign>) => void;
  defaultStage?: string;
}

const stages = [
  { name: 'Foundations', description: 'Build your marketing foundation' },
  { name: 'Reach', description: 'Build brand awareness' },
  { name: 'Engage', description: 'Create active engagement' },
  { name: 'Convert', description: 'Turn prospects into customers' },
  { name: 'Delight', description: 'Create loyal advocates' },
];

const frequencies = [
  { name: 'Annually', value: 'annually', duration: 365 },
  { name: 'Quarterly', value: 'quarterly', duration: 90 },
  { name: 'Monthly', value: 'monthly', duration: 30 },
  { name: '2x/Month', value: '2x-month', duration: 15 },
  { name: 'Weekly', value: 'weekly', duration: 7 },
  { name: 'Every Other Week', value: 'biweekly', duration: 14 },
  { name: 'Daily', value: 'daily', duration: 1 },
  { name: 'Custom', value: 'custom', duration: null },
];

const distributionChannels = [
  'Website',
  'Blog',
  'Email',
  'LinkedIn',
  'Twitter',
  'Instagram',
  'Facebook',
  'YouTube',
  'TikTok',
  'Podcast',
  'Press Release',
  'Direct Mail',
  'Print',
  'Radio',
  'TV',
  'Other',
];

export default function CreateCampaignModal({
  open,
  onClose,
  onSubmit,
  defaultStage,
}: CreateCampaignModalProps) {
  // Get tomorrow's date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get date 90 days from tomorrow
  const getNinetyDaysFromTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const ninetyDays = new Date(tomorrow);
    ninetyDays.setDate(tomorrow.getDate() + 90);
    return ninetyDays.toISOString().split('T')[0];
  };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState(defaultStage || stages[0].name);
  const [selectedTactic, setSelectedTactic] = useState<Tactic | null>(null);
  const [customTactic, setCustomTactic] = useState('');
  const [startDate, setStartDate] = useState(getTomorrow());
  const [endDate, setEndDate] = useState(getNinetyDaysFromTomorrow());
  const [frequency, setFrequency] = useState('quarterly');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Update stage when defaultStage changes
  useEffect(() => {
    if (defaultStage) {
      setStage(defaultStage);
    }
  }, [defaultStage]);

  // Reset dates when modal opens
  useEffect(() => {
    if (open) {
      setStartDate(getTomorrow());
      setEndDate(getNinetyDaysFromTomorrow());
    }
  }, [open]);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(e.target.value);
  };

  const handleTacticSelect = (tactic: Tactic | null) => {
    setSelectedTactic(tactic);
    if (tactic === null) {
      setCustomTactic('');
    }
  };

  const handleCreateNewTactic = (name: string) => {
    setSelectedTactic(null);
    setCustomTactic(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Form submission values:', {
      name,
      description,
      stage,
      selectedTactic,
      customTactic,
      startDate,
      endDate,
      frequency,
      selectedChannels,
    });

    if (
      !name ||
      !stage ||
      !(selectedTactic || customTactic) ||
      !startDate ||
      !endDate ||
      !frequency
    ) {
      setError('Please fill in all required fields');
      return;
    }

    const campaignData: Partial<Campaign> = {
      name,
      description: description || null,
      stage,
      tactic_id: selectedTactic?.id || null,
      custom_tactic: customTactic || null,
      start_date: startDate,
      end_date: endDate,
      status: 'draft',
      frequency,
      distribution_channels: selectedChannels.length > 0 ? selectedChannels : null,
    };

    console.log('Submitting campaign data:', campaignData);

    onSubmit(campaignData);

    // Reset form
    setName('');
    setDescription('');
    setStage(defaultStage || stages[0].name);
    setSelectedTactic(null);
    setCustomTactic('');
    setStartDate(getTomorrow());
    setEndDate(getNinetyDaysFromTomorrow());
    setFrequency('quarterly');
    setSelectedChannels([]);
    setError('');
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
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Create New Campaign
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-6">
                      {error && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
                          <div className="text-sm text-red-700">{error}</div>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Campaign Name
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
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                              Stage
                            </label>
                            <select
                              id="stage"
                              name="stage"
                              required
                              value={stage}
                              onChange={(e) => setStage(e.target.value)}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                            >
                              <option value="">Select a stage</option>
                              {stages.map((s) => (
                                <option key={s.name} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                              Frequency
                            </label>
                            <select
                              id="frequency"
                              name="frequency"
                              required
                              value={frequency}
                              onChange={handleFrequencyChange}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                            >
                              <option value="">Select frequency</option>
                              {frequencies.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Primary Tactic
                          </label>
                          <div className="mt-2">
                            <TacticSelector
                              stage={stage}
                              onSelect={handleTacticSelect}
                              onCreateNew={handleCreateNewTactic}
                            />
                            {selectedTactic && (
                              <div className="mt-2 rounded-md bg-coral/10 p-3">
                                <h4 className="font-medium text-coral">{selectedTactic.name}</h4>
                                <p className="mt-1 text-sm text-gray-600">{selectedTactic.description}</p>
                                {selectedTactic.example && (
                                  <p className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Example:</span> {selectedTactic.example}
                                  </p>
                                )}
                              </div>
                            )}
                            {customTactic && (
                              <div className="mt-2 rounded-md bg-gray-50 p-3">
                                <p className="text-sm text-gray-600">
                                  Custom tactic: <span className="font-medium">{customTactic}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Distribution Channels
                          </label>
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {distributionChannels.map((channel) => (
                              <label key={channel} className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-coral focus:ring-coral"
                                  checked={selectedChannels.includes(channel)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedChannels([...selectedChannels, channel]);
                                    } else {
                                      setSelectedChannels(selectedChannels.filter((c) => c !== channel));
                                    }
                                  }}
                                />
                                <span className="ml-2 text-sm text-gray-700">{channel}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                              Start Date
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              id="startDate"
                              required
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
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
                              required
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                        >
                          Create Campaign
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
