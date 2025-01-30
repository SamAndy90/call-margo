'use client';

import { Fragment, useEffect, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Tactic {
  id: string;
  name: string;
  description: string | null;
  journey_stage: string;
  frequency: string;
  distribution_channels: string[];
  created_at: string;
  updated_at: string;
}

interface TacticSelectorProps {
  onSelect: (tactic: Tactic | null) => void;
  onCreateNew?: (name: string) => void;
  stage?: string;
  defaultValue?: string;
}

export default function TacticSelector({ onSelect, onCreateNew, stage, defaultValue }: TacticSelectorProps) {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [selected, setSelected] = useState<Tactic | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tactics' + (stage ? `?stage=${stage}` : ''));
        if (!response.ok) {
          throw new Error('Failed to fetch tactics');
        }
        const data = await response.json();
        setTactics(data);
        
        if (defaultValue) {
          const defaultTactic = data.find((t: Tactic) => t.name === defaultValue);
          if (defaultTactic) {
            setSelected(defaultTactic);
            onSelect(defaultTactic);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching tactics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stage, defaultValue, onSelect]);

  const filteredTactics = query === ''
    ? tactics
    : tactics.filter((tactic) =>
        tactic.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );

  if (loading) return <div>Loading tactics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Combobox value={selected} onChange={(tactic: Tactic | null) => {
      setSelected(tactic);
      onSelect(tactic);
    }}>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-coral-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(tactic: Tactic) => tactic?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Select a tactic or start typing to search..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
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
              <>
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
                {onCreateNew && (
                  <button
                    onClick={() => onCreateNew(query)}
                    className="relative w-full cursor-pointer select-none py-2 px-4 text-left text-coral hover:bg-coral/10"
                  >
                    Create new tactic: &quot;{query}&quot;
                  </button>
                )}
              </>
            ) : (
              filteredTactics.map((tactic) => (
                <Combobox.Option
                  key={tactic.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-coral text-white' : 'text-gray-900'
                    }`
                  }
                  value={tactic}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {tactic.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-coral'
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
  );
}
