import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import FormField from "@/components/Forms/FormField";
import ListField from "@/components/Forms/ListField";
import VoiceOfCustomerForm from "./VoiceOfCustomerForm";
import { Database } from "@/types/supabase";
import type { Json } from "@/types/json";

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

type AudienceProfile = Database["public"]["Tables"]["audience_profiles"]["Row"];

interface Props {
  profile: AudienceProfile;
  onProfileChange?: (
    field: keyof AudienceProfile,
    value: string | string[] | Json | null
  ) => void;
  onAddVoiceOfCustomer?: (
    data: Omit<VoiceOfCustomer, "id" | "audience_profile_id">
  ) => void;
  onAddNote?: (
    data: Omit<AudienceNote, "id" | "audience_profile_id" | "created_by">
  ) => void;
}

// Base type for type checking
interface BaseRecord {
  [key: string]: unknown;
}

// Type guard helpers
function hasRequiredVocProperties(obj: unknown): obj is VoiceOfCustomer {
  const record = obj as BaseRecord;
  return (
    obj !== null &&
    typeof obj === "object" &&
    typeof record.title === "string" &&
    typeof record.quote === "string" &&
    typeof record.customer_name === "string" &&
    typeof record.customer_title === "string"
  );
}

function hasRequiredNoteProperties(obj: unknown): obj is AudienceNote {
  const record = obj as BaseRecord;
  return (
    obj !== null &&
    typeof obj === "object" &&
    typeof record.title === "string" &&
    typeof record.content === "string"
  );
}

function getVoiceOfCustomers(data: Json | null): VoiceOfCustomer[] {
  if (!data || !Array.isArray(data)) return [];
  // First cast to unknown, then filter with type guard
  return (data as unknown[]).filter(hasRequiredVocProperties);
}

function getAudienceNotes(data: Json | null): AudienceNote[] {
  if (!data || !Array.isArray(data)) return [];
  // First cast to unknown, then filter with type guard
  return (data as unknown[]).filter(hasRequiredNoteProperties);
}

export default function AudienceProfileDetails({
  profile,
  onProfileChange,
  onAddVoiceOfCustomer,
  onAddNote,
}: Props) {
  const [isVocFormOpen, setIsVocFormOpen] = useState(false);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);

  const handleChange = (
    field: keyof AudienceProfile,
    value: string | string[] | Json | null
  ) => {
    onProfileChange?.(field, value);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">
          {profile.name || "New Profile"}
        </h3>

        <div className="mt-6 space-y-6">
          <FormField
            label="Name"
            id="name"
            value={profile.name}
            onChange={(value) => handleChange("name", value)}
          />

          <FormField
            label="Description"
            id="description"
            value={profile.description || ""}
            onChange={(value) => handleChange("description", value)}
          />

          <ListField
            label="Problems"
            id="problems"
            values={(profile.problems as string[]) || []}
            onChange={(value) => handleChange("problems", value)}
          />

          <ListField
            label="Product Solutions"
            id="product_solutions"
            values={(profile.product_solutions as string[]) || []}
            onChange={(value) => handleChange("product_solutions", value)}
          />

          <ListField
            label="Attraction Channels"
            id="attraction_channels"
            values={profile.attraction_channels || []}
            onChange={(value) => handleChange("attraction_channels", value)}
          />

          <ListField
            label="Engagement Channels"
            id="engagement_channels"
            values={profile.engagement_channels || []}
            onChange={(value) => handleChange("engagement_channels", value)}
          />

          <ListField
            label="Most Valuable Segments"
            id="most_valuable_segments"
            values={profile.most_valuable_segments || []}
            onChange={(value) => handleChange("most_valuable_segments", value)}
          />

          <ListField
            label="Common Objections"
            id="common_objections"
            values={(profile.common_objections as string[]) || []}
            onChange={(value) => handleChange("common_objections", value)}
          />

          <ListField
            label="Common Channels"
            id="common_channels"
            values={profile.common_channels || []}
            onChange={(value) => handleChange("common_channels", value)}
          />

          <ListField
            label="Trusted Platforms"
            id="trusted_platforms"
            values={profile.trusted_platforms || []}
            onChange={(value) => handleChange("trusted_platforms", value)}
          />

          <ListField
            label="Complementary Problems"
            id="complementary_problems"
            values={(profile.complementary_problems as string[]) || []}
            onChange={(value) => handleChange("complementary_problems", value)}
          />

          {/* Voice of Customer Section */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                Voice of Customer
              </h4>
              <button
                type="button"
                onClick={() => setIsVocFormOpen(true)}
                className="inline-flex items-center text-sm text-coral hover:text-coral/90"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Quote
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {getVoiceOfCustomers(profile.voice_of_customer).map(
                (voc, index) => (
                  <div
                    key={voc.id || index}
                    className="rounded-md bg-gray-50 p-3"
                  >
                    <p className="text-sm text-gray-700">{voc.quote}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      - {voc.customer_name}, {voc.customer_title}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Notes</h4>
              <button
                type="button"
                onClick={() => setIsNoteFormOpen(true)}
                className="inline-flex items-center text-sm text-coral hover:text-coral/90"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Note
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {getAudienceNotes(profile.notes).map((note, index) => (
                <div
                  key={note.id || index}
                  className="rounded-md bg-gray-50 p-3"
                >
                  <h5 className="text-sm font-medium text-gray-900">
                    {note.title}
                  </h5>
                  <p className="mt-1 text-sm text-gray-700">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isVocFormOpen && (
        <VoiceOfCustomerForm
          onSubmit={(data) => {
            onAddVoiceOfCustomer?.(data);
            setIsVocFormOpen(false);
          }}
          onCancel={() => setIsVocFormOpen(false)}
        />
      )}

      {isNoteFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Note</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddNote?.({
                  title: formData.get("title") as string,
                  content: formData.get("content") as string,
                });
                setIsNoteFormOpen(false);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral focus:ring-coral sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90 sm:col-start-2"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsNoteFormOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
