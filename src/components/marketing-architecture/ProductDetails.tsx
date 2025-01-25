import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import FormField from '@/components/forms/FormField';
import ListField from '@/components/forms/ListField';

interface ProductNote {
  id?: string;
  product_id: string;
  title: string;
  content: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface Product {
  id?: string;
  user_id: string;
  name: string;
  type: 'Physical Product' | '1-1 Service' | 'Course' | 'Community' | 'SaaS' | 'Digital Product' | 'Software' | 'Other';
  custom_type?: string;
  purpose_benefit: string;
  audience_ids: string[];
  description: string;
  market_category: string;
  problems_solved: string[];
  price_points: {
    name: string;
    price: string;
    features: string[];
  }[];
  notes?: ProductNote[];
  created_at?: Date;
  updated_at?: Date;
}

interface Props {
  product: Product;
  audiences: { id: string; name: string }[];
  onProductChange: (field: keyof Product, value: string | string[] | Product['price_points']) => void;
  onAddNote: (data: Omit<ProductNote, 'id' | 'product_id' | 'created_by'>) => void;
}

export default function ProductDetails({
  product,
  audiences,
  onProductChange,
  onAddNote,
}: Props) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote(newNote);
    setNewNote({ title: '', content: '' });
    setShowNoteForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <FormField
              label="Product Name"
              value={product.name}
              onChange={(value) => onProductChange('name', value)}
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={product.type}
              onChange={(e) => onProductChange('type', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
            >
              <option value="Physical Product">Physical Product</option>
              <option value="1-1 Service">1-1 Service</option>
              <option value="Course">Course</option>
              <option value="Community">Community</option>
              <option value="SaaS">SaaS</option>
              <option value="Digital Product">Digital Product</option>
              <option value="Software">Software</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {product.type === 'Other' && (
            <div className="sm:col-span-4">
              <FormField
                label="Custom Type"
                value={product.custom_type || ''}
                onChange={(value) => onProductChange('custom_type', value)}
              />
            </div>
          )}

          <div className="sm:col-span-6">
            <FormField
              label="Purpose/Benefit"
              value={product.purpose_benefit}
              onChange={(value) => onProductChange('purpose_benefit', value)}
              multiline
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Target Audiences</label>
            <div className="mt-1">
              {audiences.map((audience) => (
                <label key={audience.id} className="inline-flex items-center mr-4 mt-2">
                  <input
                    type="checkbox"
                    checked={product.audience_ids.includes(audience.id)}
                    onChange={(e) => {
                      const newAudiences = e.target.checked
                        ? [...product.audience_ids, audience.id]
                        : product.audience_ids.filter((id) => id !== audience.id);
                      onProductChange('audience_ids', newAudiences);
                    }}
                    className="rounded border-gray-300 text-coral-600 focus:ring-coral-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{audience.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-6">
            <FormField
              label="Description"
              value={product.description}
              onChange={(value) => onProductChange('description', value)}
              multiline
            />
          </div>

          <div className="sm:col-span-4">
            <FormField
              label="Market Category"
              value={product.market_category}
              onChange={(value) => onProductChange('market_category', value)}
            />
          </div>

          <div className="sm:col-span-6">
            <ListField
              label="Problems Solved"
              values={product.problems_solved}
              onChange={(values) => onProductChange('problems_solved', values)}
            />
          </div>
        </div>
      </div>

      {/* Price Points */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Price Points</h3>
          <button
            type="button"
            onClick={() => {
              const newPricePoints = [
                ...product.price_points,
                { name: '', price: '', features: [] },
              ];
              onProductChange('price_points', newPricePoints);
            }}
            className="inline-flex items-center rounded-md bg-coral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Price Point
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {product.price_points.map((pricePoint, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Name"
                  value={pricePoint.name}
                  onChange={(value) => {
                    const newPricePoints = [...product.price_points];
                    newPricePoints[index] = { ...pricePoint, name: value };
                    onProductChange('price_points', newPricePoints);
                  }}
                />
                <FormField
                  label="Price"
                  value={pricePoint.price}
                  onChange={(value) => {
                    const newPricePoints = [...product.price_points];
                    newPricePoints[index] = { ...pricePoint, price: value };
                    onProductChange('price_points', newPricePoints);
                  }}
                />
                <div className="sm:col-span-2">
                  <ListField
                    label="Features"
                    values={pricePoint.features}
                    onChange={(values) => {
                      const newPricePoints = [...product.price_points];
                      newPricePoints[index] = { ...pricePoint, features: values };
                      onProductChange('price_points', newPricePoints);
                    }}
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
                  Remove Price Point
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
            className="inline-flex items-center rounded-md bg-coral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Note
          </button>
        </div>

        {showNoteForm && (
          <form onSubmit={handleNoteSubmit} className="mt-4">
            <div className="space-y-4">
              <FormField
                label="Title"
                value={newNote.title}
                onChange={(value) => setNewNote({ ...newNote, title: value })}
              />
              <FormField
                label="Content"
                value={newNote.content}
                onChange={(value) => setNewNote({ ...newNote, content: value })}
                multiline
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNoteForm(false)}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md bg-coral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600"
                >
                  Save Note
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="mt-6 flow-root">
          <ul className="-mb-8">
            {product.notes?.map((note, noteIdx) => (
              <li key={note.id}>
                <div className="relative pb-8">
                  {noteIdx !== product.notes!.length - 1 ? (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                        <span className="text-white text-sm">
                          {note.title.charAt(0).toUpperCase()}
                        </span>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{note.title}</p>
                        <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={note.created_at?.toISOString()}>
                          {note.created_at
                            ? new Date(note.created_at).toLocaleDateString()
                            : 'Unknown date'}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
