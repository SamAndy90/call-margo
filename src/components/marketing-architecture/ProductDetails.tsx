'use client';

import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import FormField from '@/components/forms/FormField';
import ListField from '@/components/forms/ListField';

interface PricePoint {
  id: string;
  name: string;
  price: string;
  features: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  value_proposition: string;
  target_market: string[];
  problems_solved: string[];
  key_features: string[];
  benefits: string[];
  price_points: PricePoint[];
  audience_ids: string[];
}

interface Props {
  product: Product;
  onProductChange: (field: keyof Product, value: any) => void;
  onAddNote: (data: any) => void;
}

const defaultAudiences = [
  { id: '1', name: 'Small Business Owners', selected: false },
  { id: '2', name: 'Marketing Professionals', selected: false },
  { id: '3', name: 'Startup Founders', selected: false },
  { id: '4', name: 'Enterprise Companies', selected: false },
  { id: '5', name: 'Freelancers', selected: false },
  { id: '6', name: 'E-commerce Businesses', selected: false },
];

export default function ProductDetails({
  product,
  onProductChange,
  onAddNote,
}: Props) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });
  const [selectedAudiences, setSelectedAudiences] = useState(defaultAudiences.map(audience => ({
    ...audience,
    selected: product.audience_ids.includes(audience.id)
  })));

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote(newNote);
    setNewNote({ title: '', content: '' });
    setShowNoteForm(false);
  };

  const handleAudienceChange = (audienceId: string) => {
    setSelectedAudiences(selectedAudiences.map(audience =>
      audience.id === audienceId
        ? { ...audience, selected: !audience.selected }
        : audience
    ));
    const newAudiences = selectedAudiences.filter(a => a.selected).map(a => a.id);
    onProductChange('audience_ids', newAudiences);
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
          <button
            type="button"
            onClick={() => {
              const newAudiences = [...product.audience_ids, ''];
              onProductChange('audience_ids', newAudiences);
            }}
            className="inline-flex items-center rounded-md border border-transparent bg-[#D06E63] px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-[#BB635A] focus:outline-none focus:ring-2 focus:ring-[#D06E63] focus:ring-offset-2"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Audience Profile
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <FormField
              id="product-name"
              label="Product Name"
              value={product.name}
              onChange={(value) => onProductChange('name', value)}
            />
          </div>

          <div className="sm:col-span-6">
            <FormField
              id="description"
              label="Description"
              value={product.description}
              onChange={(value) => onProductChange('description', value)}
              type="textarea"
            />
          </div>

          <div className="sm:col-span-6">
            <FormField
              id="value-proposition"
              label="Value Proposition"
              value={product.value_proposition}
              onChange={(value) => onProductChange('value_proposition', value)}
              type="textarea"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Target Audiences</label>
            <div className="mt-1">
              {selectedAudiences.map((audience) => (
                <label key={audience.id} className="inline-flex items-center mr-4 mt-2">
                  <input
                    type="checkbox"
                    checked={audience.selected}
                    onChange={() => handleAudienceChange(audience.id)}
                    className="rounded border-gray-300 text-[#D06E63] focus:ring-[#D06E63]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{audience.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market & Features */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Market & Features</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <ListField
              label="Target Market"
              items={product.target_market}
              onChange={(items) => onProductChange('target_market', items)}
              placeholder="Add target market segment..."
            />
          </div>

          <div className="sm:col-span-6">
            <ListField
              label="Problems Solved"
              items={product.problems_solved}
              onChange={(items) => onProductChange('problems_solved', items)}
              placeholder="Add a problem..."
            />
          </div>

          <div className="sm:col-span-6">
            <ListField
              label="Key Features"
              items={product.key_features}
              onChange={(items) => onProductChange('key_features', items)}
              placeholder="Add a feature..."
            />
          </div>

          <div className="sm:col-span-6">
            <ListField
              label="Benefits"
              items={product.benefits}
              onChange={(items) => onProductChange('benefits', items)}
              placeholder="Add a benefit..."
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Pricing Tiers</h3>
          <button
            type="button"
            onClick={() => {
              const newPricePoints = [
                ...product.price_points,
                { id: '', name: '', price: '', features: [] },
              ];
              onProductChange('price_points', newPricePoints);
            }}
            className="inline-flex items-center rounded-md border border-transparent bg-[#D06E63] px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-[#BB635A] focus:outline-none focus:ring-2 focus:ring-[#D06E63] focus:ring-offset-2"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Pricing Tier
          </button>
        </div>
        <div className="mt-6 space-y-6">
          {product.price_points.map((pricePoint, index) => (
            <div key={pricePoint.id || index} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <FormField
                    id={`price-point-name-${index}`}
                    label="Tier Name"
                    value={pricePoint.name}
                    onChange={(value) => {
                      const newPricePoints = [...product.price_points];
                      newPricePoints[index] = { ...pricePoint, name: value };
                      onProductChange('price_points', newPricePoints);
                    }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    id={`price-point-price-${index}`}
                    label="Price"
                    value={pricePoint.price}
                    onChange={(value) => {
                      const newPricePoints = [...product.price_points];
                      newPricePoints[index] = { ...pricePoint, price: value };
                      onProductChange('price_points', newPricePoints);
                    }}
                  />
                </div>

                <div className="sm:col-span-6">
                  <ListField
                    label="Features"
                    items={pricePoint.features}
                    onChange={(items) => {
                      const newPricePoints = [...product.price_points];
                      newPricePoints[index] = { ...pricePoint, features: items };
                      onProductChange('price_points', newPricePoints);
                    }}
                    placeholder="Add a feature..."
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newPricePoints = product.price_points.filter((_, i) => i !== index);
                    onProductChange('price_points', newPricePoints);
                  }}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Remove Pricing Tier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add notes to track important product information and updates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNoteForm(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-[#D06E63] px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-[#BB635A] focus:outline-none focus:ring-2 focus:ring-[#D06E63] focus:ring-offset-2"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Note
          </button>
        </div>

        {showNoteForm && (
          <form onSubmit={handleNoteSubmit} className="mt-4">
            <div className="space-y-4">
              <FormField
                id="note-title"
                label="Title"
                value={newNote.title}
                onChange={(value) => setNewNote({ ...newNote, title: value })}
              />
              <FormField
                id="note-content"
                label="Content"
                value={newNote.content}
                onChange={(value) => setNewNote({ ...newNote, content: value })}
                type="textarea"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNoteForm(false)}
                  className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-[#D06E63] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#BB635A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D06E63]"
                >
                  Save Note
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="mt-6 flow-root">
          <ul className="-mb-8">
            {/* Add notes here */}
          </ul>
        </div>
      </div>
    </div>
  );
}
