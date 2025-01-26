import { Fragment, useState, useEffect } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface TacticSelectorProps {
  stage: string;
  onSelect: (tactic: any) => void;
  onCreateNew: (name: string) => void;
}

export default function TacticSelector({ stage, onSelect, onCreateNew }: TacticSelectorProps) {
  const [query, setQuery] = useState('');
  const [tactics, setTactics] = useState<any[]>([]);
  const [selectedTactic, setSelectedTactic] = useState<any>(null);
  const [filters, setFilters] = useState({
    audienceType: '',
    productType: '',
    channel: '',
    budget: '',
  });
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchTactics();
  }, [stage, filters]);

  const fetchTactics = async () => {
    try {
      let queryBuilder = supabase
        .from('tactics')
        .select('*');

      // Apply stage filter
      if (stage) {
        queryBuilder = queryBuilder.eq('stage', stage);
      }

      // Apply additional filters if they exist
      if (filters.audienceType) {
        queryBuilder = queryBuilder.contains('audience_types', [filters.audienceType]);
      }
      if (filters.productType) {
        queryBuilder = queryBuilder.contains('product_types', [filters.productType]);
      }
      if (filters.channel) {
        queryBuilder = queryBuilder.contains('channels', [filters.channel]);
      }
      if (filters.budget) {
        queryBuilder = queryBuilder.eq('budget_range', filters.budget);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Supabase error:', error.message);
        return;
      }

      setTactics(data || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching tactics:', error.message);
      } else {
        console.error('Unknown error fetching tactics');
      }
    }
  };

  const filteredTactics =
    query === ''
      ? tactics
      : tactics.filter((tactic) => {
          return (
            tactic.name?.toLowerCase().includes(query.toLowerCase()) ||
            tactic.description?.toLowerCase().includes(query.toLowerCase()) ||
            (Array.isArray(tactic.keywords) && 
              tactic.keywords.some((keyword: string) => 
                keyword.toLowerCase().includes(query.toLowerCase())
              ))
          );
        });

  const handleSelect = (tactic: any) => {
    setSelectedTactic(tactic);
    onSelect(tactic);
  };

  const handleCreateNew = () => {
    if (query.trim()) {
      onCreateNew(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="w-full">
      <Combobox value={selectedTactic} onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:border-[#d06e63] focus:outline-none focus:ring-1 focus:ring-[#d06e63]"
              placeholder="Search tactics or enter a new one..."
              displayValue={(tactic: any) => tactic?.name || ''}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>

          {/* Filters */}
          <div className="mt-2 flex flex-wrap gap-2">
            <select
              value={filters.audienceType}
              onChange={(e) => setFilters({ ...filters, audienceType: e.target.value })}
              className="rounded-md border-gray-300 text-sm focus:border-[#d06e63] focus:ring-[#d06e63]"
            >
              <option value="">Audience Type</option>
              <option value="b2b">B2B</option>
              <option value="b2c">B2C</option>
              <option value="enterprise">Enterprise</option>
            </select>

            <select
              value={filters.productType}
              onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
              className="rounded-md border-gray-300 text-sm focus:border-[#d06e63] focus:ring-[#d06e63]"
            >
              <option value="">Product Type</option>
              <option value="saas">SaaS</option>
              <option value="physical">Physical Product</option>
              <option value="service">Service</option>
            </select>

            <select
              value={filters.channel}
              onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
              className="rounded-md border-gray-300 text-sm focus:border-[#d06e63] focus:ring-[#d06e63]"
            >
              <option value="">Channel</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="content">Content Marketing</option>
              <option value="ads">Paid Ads</option>
            </select>

            <select
              value={filters.budget}
              onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
              className="rounded-md border-gray-300 text-sm focus:border-[#d06e63] focus:ring-[#d06e63]"
            >
              <option value="">Budget Range</option>
              <option value="low">Low ($0-1k)</option>
              <option value="medium">Medium ($1k-10k)</option>
              <option value="high">High ($10k+)</option>
            </select>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredTactics.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  <p>No existing tactics found.</p>
                  <button
                    onClick={handleCreateNew}
                    className="mt-2 text-sm font-medium text-[#d06e63] hover:text-[#b85c52]"
                  >
                    Create "{query}" as a new tactic
                  </button>
                </div>
              ) : (
                filteredTactics.map((tactic) => (
                  <Combobox.Option
                    key={tactic.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-[#fdf1f0] text-[#d06e63]' : 'text-gray-900'
                      }`
                    }
                    value={tactic}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex flex-col">
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {tactic.name}
                          </span>
                          <span className="block truncate text-sm text-gray-500">
                            {tactic.description}
                          </span>
                        </div>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-[#d06e63]' : 'text-[#d06e63]'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
