import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
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
  onProfileChange: (field: keyof AudienceProfile, value: string | string[] | boolean) => void;
  onAddVoiceOfCustomer: (data: Omit<VoiceOfCustomer, 'id' | 'audience_profile_id'>) => void;
  onAddNote: (data: Omit<AudienceNote, 'id' | 'audience_profile_id' | 'created_by'>) => void;
}

export default function AudienceProfileDetails({
  profile = {
    user_id: '',
    name: '',
    description: '',
    problems: [],
    product_solutions: [],
    attraction_channels: [],
    engagement_channels: [],
    valuable_segments: '',
    common_objections: [],
    common_channels: [],
    trusted_platforms: [],
    complementary_problems: [],
    voc_data: [],
    notes: []
  },
  onProfileChange,
  onAddVoiceOfCustomer,
  onAddNote,
}: Props) {
  const [showVocForm, setShowVocForm] = useState(false);

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
                value={profile.name || ''}
                onChange={(value) => onProfileChange('name', value)}
              />
              <FormField
                label="Description"
                id="description"
                type="textarea"
                value={profile.description || ''}
                onChange={(value) => onProfileChange('description', value)}
              />
              <ListField
                label="Problems"
                id="problems"
                items={profile.problems || []}
                onChange={(items) => onProfileChange('problems', items)}
              />
              <ListField
                label="Product Solutions"
                id="product_solutions"
                items={profile.product_solutions || []}
                onChange={(items) => onProfileChange('product_solutions', items)}
              />
              <ListField
                label="Attraction Channels"
                id="attraction_channels"
                items={profile.attraction_channels || []}
                onChange={(items) => onProfileChange('attraction_channels', items)}
              />
              <ListField
                label="Engagement Channels"
                id="engagement_channels"
                items={profile.engagement_channels || []}
                onChange={(items) => onProfileChange('engagement_channels', items)}
              />
              <FormField
                label="Valuable Segments"
                id="valuable_segments"
                type="textarea"
                value={profile.valuable_segments || ''}
                onChange={(value) => onProfileChange('valuable_segments', value)}
              />
              <ListField
                label="Common Objections"
                id="common_objections"
                items={profile.common_objections || []}
                onChange={(items) => onProfileChange('common_objections', items)}
              />
              <ListField
                label="Common Channels"
                id="common_channels"
                items={profile.common_channels || []}
                onChange={(items) => onProfileChange('common_channels', items)}
              />
              <ListField
                label="Trusted Platforms"
                id="trusted_platforms"
                items={profile.trusted_platforms || []}
                onChange={(items) => onProfileChange('trusted_platforms', items)}
              />
              <ListField
                label="Complementary Problems"
                id="complementary_problems"
                items={profile.complementary_problems || []}
                onChange={(items) => onProfileChange('complementary_problems', items)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Voice of Customer Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Voice of Customer</h3>
            <button
              type="button"
              onClick={() => setShowVocForm(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#D06E63] hover:bg-[#BB635A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D06E63]"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
              Add VOC
            </button>
          </div>
          {showVocForm && (
            <VoiceOfCustomerForm
              onSubmit={(data) => {
                onAddVoiceOfCustomer(data);
                setShowVocForm(false);
              }}
              onCancel={() => setShowVocForm(false)}
            />
          )}
          <div className="mt-4 space-y-4">
            {(profile.voc_data || []).map((voc) => (
              <div
                key={voc.id}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h4 className="text-sm font-medium text-gray-900">{voc.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{voc.quote}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {voc.customer_name} - {voc.customer_title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notes</h3>
            <button
              type="button"
              onClick={() => onAddNote({
                title: 'New Note',
                content: ''
              })}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#D06E63] hover:bg-[#BB635A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D06E63]"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
              Add Note
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {(profile.notes || []).map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h4 className="text-sm font-medium text-gray-900">{note.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
