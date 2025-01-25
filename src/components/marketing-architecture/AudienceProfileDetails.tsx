import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FormField from '@/components/forms/FormField';
import ListField from '@/components/forms/ListField';
import VoiceOfCustomerForm from './VoiceOfCustomerForm';

interface VoiceOfCustomer {
  id?: string;
  audience_profile_id: string;
  title: string;
  quote: string;
  customer_name: string;
  customer_title: string;
  attachment_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface AudienceNote {
  id?: string;
  audience_profile_id: string;
  title: string;
  content: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface AudienceProfile {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  problems: string[];
  product_solutions: string[];
  attraction_channels: string[];
  engagement_channels: string[];
  valuable_segments: string;
  common_objections: string[];
  common_channels: string[];
  trusted_platforms: string[];
  complementary_problems: string[];
  voc_data?: VoiceOfCustomer[];
  notes?: AudienceNote[];
  created_at?: Date;
  updated_at?: Date;
}

interface Props {
  profile: AudienceProfile;
  onProfileChange: (field: string, value: any) => void;
  onAddVoiceOfCustomer: (data: Omit<VoiceOfCustomer, 'id' | 'audience_profile_id'>) => void;
  onAddNote: (data: Omit<AudienceNote, 'id' | 'audience_profile_id' | 'created_by'>) => void;
}

export default function AudienceProfileDetails({
  profile,
  onProfileChange,
  onAddVoiceOfCustomer,
  onAddNote,
}: Props) {
  const [showVocForm, setShowVocForm] = useState(false);
  
  const {
    name = '',
    description = '',
    problems = [],
    product_solutions = [],
    attraction_channels = [],
    engagement_channels = [],
    valuable_segments = '',
    common_objections = [],
    common_channels = [],
    trusted_platforms = [],
    complementary_problems = [],
    voc_data = [],
    notes = [],
  } = profile;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Define the core characteristics of this audience segment.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 space-y-4">
              <FormField
                label="Name"
                id="name"
                value={name}
                onChange={(value) => onProfileChange('name', value)}
              />
              <FormField
                label="Description"
                id="description"
                type="textarea"
                value={description}
                onChange={(value) => onProfileChange('description', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Problems & Solutions Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Problems & Solutions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Identify key pain points and how your product addresses them.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Problems</h4>
                  <ListField
                    label="Problems"
                    items={problems}
                    onChange={(value) => onProfileChange('problems', value)}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Solutions</h4>
                  <ListField
                    label="Product Solutions"
                    items={product_solutions}
                    onChange={(value) => onProfileChange('product_solutions', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channels Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Channels</h3>
              <p className="mt-1 text-sm text-gray-500">
                Map out where and how to reach this audience effectively.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Attraction</h4>
                  <ListField
                    label="Attraction Channels"
                    items={attraction_channels}
                    onChange={(value) => onProfileChange('attraction_channels', value)}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Engagement</h4>
                  <ListField
                    label="Engagement Channels"
                    items={engagement_channels}
                    onChange={(value) => onProfileChange('engagement_channels', value)}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Common Channels</h4>
                  <ListField
                    label="Common Channels"
                    items={common_channels}
                    onChange={(value) => onProfileChange('common_channels', value)}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Trusted Platforms</h4>
                  <ListField
                    label="Trusted Platforms"
                    items={trusted_platforms}
                    onChange={(value) => onProfileChange('trusted_platforms', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segments & Objections Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Segments & Objections</h3>
              <p className="mt-1 text-sm text-gray-500">
                Define valuable segments and address common concerns.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Most Valuable Segments</h4>
                  <FormField
                    label="Valuable Customer Segments"
                    id="valuable_segments"
                    type="textarea"
                    value={valuable_segments}
                    onChange={(value) => onProfileChange('valuable_segments', value)}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Objections</h4>
                  <ListField
                    label="Common Objections"
                    items={common_objections}
                    onChange={(value) => onProfileChange('common_objections', value)}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Related Problems</h4>
                  <ListField
                    label="Complementary Problems"
                    items={complementary_problems}
                    onChange={(value) => onProfileChange('complementary_problems', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice of Customer Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="flex items-center justify-between md:block">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Voice of Customer</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Capture real feedback and testimonials from customers.
                  </p>
                </div>
                {!showVocForm && (
                  <button
                    type="button"
                    onClick={() => setShowVocForm(true)}
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-coral-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add VOC
                  </button>
                )}
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                {showVocForm && (
                  <VoiceOfCustomerForm
                    onSubmit={(data) => {
                      onAddVoiceOfCustomer(data);
                      setShowVocForm(false);
                    }}
                    onCancel={() => setShowVocForm(false)}
                  />
                )}
                
                {voc_data.map((voc) => (
                  <div key={voc.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900">{voc.title}</div>
                    <div className="mt-2 text-sm text-gray-600 italic">"{voc.quote}"</div>
                    <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                      <span>
                        - {voc.customer_name}
                        {voc.customer_title && `, ${voc.customer_title}`}
                      </span>
                      {voc.created_at && (
                        <span className="text-xs">
                          {new Date(voc.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {!showVocForm && voc_data.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">No voice of customer data yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Click the "Add VOC" button to add customer feedback.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="flex items-center justify-between md:block">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Notes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Keep track of important observations and insights.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddNote({
                    title: '',
                    content: '',
                  })}
                  className="mt-4 inline-flex items-center rounded-md border border-transparent bg-coral-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Note
                </button>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900">{note.title}</div>
                    <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{note.content}</div>
                    <div className="mt-2 text-xs text-gray-500">
                      {note.created_at && new Date(note.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">No notes yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Click the "Add Note" button to create a note.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
