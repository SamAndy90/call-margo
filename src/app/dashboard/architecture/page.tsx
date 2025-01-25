'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

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

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'textarea' | 'email' | 'url';
  placeholder?: string;
  rows?: number;
}

function FormField({ label, id, type = 'text', placeholder, rows = 3 }: FormFieldProps) {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <Component
          id={id}
          name={id}
          type={type}
          rows={isTextarea ? rows : undefined}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default function MarketingArchitecture() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Marketing Architecture</h1>
          <p className="mt-2 text-sm text-gray-700">
            Define and manage your marketing foundation, strategy, and infrastructure.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-coral-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New
          </button>
        </div>
      </div>

      <div className="mt-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'py-3 px-4 text-sm font-medium border-b-2 -mb-px focus:outline-none',
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
            {/* Company Panel */}
            <Tab.Panel className="space-y-6">
              <FormField
                label="Company Name"
                id="companyName"
                placeholder="Enter your company name"
              />
              <FormField
                label="Description"
                id="description"
                type="textarea"
                placeholder="Brief description of your company"
              />
              <FormField
                label="Mission Statement"
                id="mission"
                type="textarea"
                placeholder="Your company's mission"
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Website"
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                />
                <FormField
                  label="Email Newsletter"
                  id="newsletter"
                  type="email"
                  placeholder="newsletter@example.com"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Strengths"
                  id="strengths"
                  type="textarea"
                  placeholder="List your company's strengths"
                />
                <FormField
                  label="Weaknesses"
                  id="weaknesses"
                  type="textarea"
                  placeholder="List areas for improvement"
                />
              </div>
              <FormField
                label="Key Differentiators"
                id="differentiators"
                type="textarea"
                placeholder="What makes your company unique?"
              />
            </Tab.Panel>

            {/* Brand Panel */}
            <Tab.Panel className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Brand Name"
                  id="brandName"
                  placeholder="Your brand name"
                />
                <FormField
                  label="Tagline"
                  id="tagline"
                  placeholder="Your brand's tagline"
                />
              </div>
              <FormField
                label="Brand Story"
                id="brandStory"
                type="textarea"
                placeholder="Tell your brand's story"
                rows={4}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Voice & Tone"
                  id="voiceTone"
                  type="textarea"
                  placeholder="Describe your brand's voice and tone"
                />
                <FormField
                  label="Visual Identity"
                  id="visualIdentity"
                  type="textarea"
                  placeholder="Describe your visual brand guidelines"
                />
              </div>
              <FormField
                label="Brand Values"
                id="brandValues"
                type="textarea"
                placeholder="List your brand's core values"
              />
            </Tab.Panel>

            {/* Channels Panel */}
            <Tab.Panel className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Primary Channels"
                  id="primaryChannels"
                  type="textarea"
                  placeholder="List your main marketing channels"
                />
                <FormField
                  label="Secondary Channels"
                  id="secondaryChannels"
                  type="textarea"
                  placeholder="List your supporting channels"
                />
              </div>
              <FormField
                label="Channel Strategy"
                id="channelStrategy"
                type="textarea"
                placeholder="Describe your channel strategy"
                rows={4}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  label="Social Media"
                  id="socialMedia"
                  type="textarea"
                  placeholder="List your social media presence"
                />
                <FormField
                  label="Content Platforms"
                  id="contentPlatforms"
                  type="textarea"
                  placeholder="List your content platforms"
                />
                <FormField
                  label="Paid Channels"
                  id="paidChannels"
                  type="textarea"
                  placeholder="List your paid marketing channels"
                />
              </div>
            </Tab.Panel>

            {/* Other panels will be implemented similarly */}
            <Tab.Panel>Audience Content</Tab.Panel>
            <Tab.Panel>Product Content</Tab.Panel>
            <Tab.Panel>Competitors Content</Tab.Panel>
            <Tab.Panel>Tech Stack Content</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
