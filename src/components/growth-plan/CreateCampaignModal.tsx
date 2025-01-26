import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { XMarkIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (campaign: Partial<Campaign>) => void;
}

const stages = [
  { id: 'foundations', name: 'Foundations', description: 'Build your marketing foundation' },
  { id: 'reach', name: 'Reach', description: 'Build brand awareness' },
  { id: 'engage', name: 'Engage', description: 'Create active engagement' },
  { id: 'convert', name: 'Convert', description: 'Turn prospects into customers' },
  { id: 'delight', name: 'Delight', description: 'Create loyal advocates' },
];

const goals = {
  foundations: ['Launch a new product', 'Launch a new company/brand', 'Decrease acquisition cost', 'Recruit talent'],
  reach: ['Build brand awareness'],
  engage: ['Create an active sales pipeline', 'Increase leads', 'Increase email newsletter subscribers'],
  convert: ['Close active deals', 'Shorten sales cycle', 'Increase new prospect conversion'],
  delight: ['Decrease churn', 'Expand existing customer wallet share', 'Increase product adoption'],
};

export default function CreateCampaignModal({
  open,
  onClose,
  onCreate,
}: CreateCampaignModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [selectedStage, setSelectedStage] = useState(stages[0]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [channels, setChannels] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('');
  const [audiences, setAudiences] = useState<any[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchAudiences();
  }, []);

  const fetchAudiences = async () => {
    try {
      // Replace with your actual audience table/query
      const { data, error } = await supabase
        .from('audience_profiles')
        .select('*');

      if (error) throw error;
      setAudiences(data || []);
    } catch (error) {
      console.error('Error fetching audiences:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampaign: Partial<Campaign> = {
      name,
      description,
      objective,
      stage: selectedStage.name,
      status: 'draft',
      start_date: startDate,
      end_date: endDate,
      channels: channels.map(channel => ({ name: channel })),
      budget: budget ? parseFloat(budget) : null,
      target_audience_ids: selectedAudiences,
      metrics: [],
    };

    onCreate(newCampaign);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setObjective('');
    setSelectedStage(stages[0]);
    setSelectedGoal('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setChannels([]);
    setBudget('');
    setSelectedAudiences([]);
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Create Campaign
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Campaign Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <Listbox value={selectedStage} onChange={setSelectedStage}>
                            <Listbox.Label className="block text-sm font-medium text-gray-700">
                              Growth Stage
                            </Listbox.Label>
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                                <span className="block truncate">{selectedStage.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {stages.map((stage) => (
                                    <Listbox.Option
                                      key={stage.id}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                        }`
                                      }
                                      value={stage}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className="block truncate font-semibold">
                                            {stage.name}
                                          </span>
                                          <span className="block truncate text-sm text-gray-500">
                                            {stage.description}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                                active ? 'text-white' : 'text-blue-600'
                                              }`}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        <div>
                          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                            Campaign Goal
                          </label>
                          <select
                            id="goal"
                            value={selectedGoal}
                            onChange={(e) => setSelectedGoal(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Select a goal</option>
                            {goals[selectedStage.id as keyof typeof goals].map((goal) => (
                              <option key={goal} value={goal}>
                                {goal}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                              Start Date
                            </label>
                            <input
                              type="date"
                              id="startDate"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                              End Date
                            </label>
                            <input
                              type="date"
                              id="endDate"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                            Budget
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              id="budget"
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="audiences" className="block text-sm font-medium text-gray-700">
                            Target Audiences
                          </label>
                          <select
                            id="audiences"
                            multiple
                            value={selectedAudiences}
                            onChange={(e) => {
                              const values = Array.from(e.target.selectedOptions, option => option.value);
                              setSelectedAudiences(values);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            {audiences.map((audience) => (
                              <option key={audience.id} value={audience.id}>
                                {audience.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
