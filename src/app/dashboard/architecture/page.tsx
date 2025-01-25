'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Company', href: '#company' },
  { name: 'Brand', href: '#brand' },
  { name: 'Channels', href: '#channels' },
  { name: 'Audience', href: '#audience' },
  { name: 'Product', href: '#product' },
  { name: 'Competitors', href: '#competitors' },
  { name: 'Tech Stack', href: '#tech-stack' },
];

export default function MarketingArchitecture() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Marketing Architecture</h1>
          <p className="mt-2 text-sm text-gray-700">
            Define and manage your marketing foundation, strategy, and infrastructure.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'py-3 px-4 text-sm font-medium border-b-2 -mb-px',
                    selected
                      ? 'border-coral-500 text-coral-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-8">
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
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
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="strengths" className="block text-sm font-medium text-gray-700">
                    Strengths
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="strengths"
                      name="strengths"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="weaknesses" className="block text-sm font-medium text-gray-700">
                    Weaknesses
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="weaknesses"
                      name="weaknesses"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="differentiators" className="block text-sm font-medium text-gray-700">
                    Key Differentiators
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="differentiators"
                      name="differentiators"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>
            {/* Add other tab panels here */}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
