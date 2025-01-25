'use client';

import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Product {
  id?: string;
  company_id: string;
  name: string;
  description: string;
  key_features: string[];
  benefits: string[];
  pricing_model: string;
  price_points: Array<{
    name: string;
    price: string;
    features: string[];
  }>;
  target_audience: string;
  competitive_advantage: string;
  development_stage: string;
  launch_date?: string;
  documentation_url?: string;
}

interface ProductFormProps {
  product?: Product;
  onSave: (product: Omit<Product, 'id'>) => Promise<void>;
  companyId: string;
}

export default function ProductForm({ product, onSave, companyId }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    company_id: companyId,
    name: product?.name || '',
    description: product?.description || '',
    key_features: product?.key_features || [],
    benefits: product?.benefits || [],
    pricing_model: product?.pricing_model || '',
    price_points: product?.price_points || [],
    target_audience: product?.target_audience || '',
    competitive_advantage: product?.competitive_advantage || '',
    development_stage: product?.development_stage || '',
    launch_date: product?.launch_date,
    documentation_url: product?.documentation_url
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newPricePoint, setNewPricePoint] = useState({
    name: '',
    price: '',
    features: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        key_features: [...prev.key_features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_features: prev.key_features.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const addPricePoint = () => {
    if (newPricePoint.name && newPricePoint.price) {
      setFormData(prev => ({
        ...prev,
        price_points: [...prev.price_points, { ...newPricePoint }]
      }));
      setNewPricePoint({ name: '', price: '', features: [] });
    }
  };

  const removePricePoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      price_points: prev.price_points.filter((_, i) => i !== index)
    }));
  };

  const handlePricePointChange = (index: number, field: string, value: string) => {
    const updatedPricePoints = [...formData.price_points];
    if (field === 'features') {
      updatedPricePoints[index] = {
        ...updatedPricePoints[index],
        features: value.split(',').map(f => f.trim())
      };
    } else {
      updatedPricePoints[index] = {
        ...updatedPricePoints[index],
        [field]: value
      };
    }
    setFormData({ ...formData, price_points: updatedPricePoints });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Product Details</h3>
          <p className="mt-1 text-sm text-gray-500">
            Provide comprehensive information about your product.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Key Features</label>
            <div className="mt-1">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                  placeholder="Add a key feature"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center rounded-md border border-transparent bg-coral-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <ul className="mt-2 divide-y divide-gray-200">
                {formData.key_features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-900">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-teal-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Benefits</label>
            <div className="mt-1">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                  placeholder="Add a benefit"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="inline-flex items-center rounded-md border border-transparent bg-coral-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <ul className="mt-2 divide-y divide-gray-200">
                {formData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-900">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-red-600 hover:text-teal-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="pricing_model" className="block text-sm font-medium text-gray-700">
              Pricing Model
            </label>
            <div className="mt-1">
              <select
                id="pricing_model"
                name="pricing_model"
                value={formData.pricing_model}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_model: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              >
                <option value="">Select a pricing model</option>
                <option value="subscription">Subscription</option>
                <option value="one-time">One-time Purchase</option>
                <option value="usage-based">Usage-based</option>
                <option value="freemium">Freemium</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Price Points</label>
            <div className="mt-1">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPricePoint.name}
                  onChange={(e) => setNewPricePoint(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={newPricePoint.price}
                  onChange={(e) => setNewPricePoint(prev => ({ ...prev, price: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                  placeholder="Price"
                />
                <input
                  type="text"
                  value={newPricePoint.features.join(', ')}
                  onChange={(e) => setNewPricePoint(prev => ({ ...prev, features: e.target.value.split(',').map(f => f.trim()) }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                  placeholder="Features"
                />
                <button
                  type="button"
                  onClick={addPricePoint}
                  className="inline-flex items-center rounded-md border border-transparent bg-coral-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <ul className="mt-2 divide-y divide-gray-200">
                {formData.price_points.map((pricePoint, index) => (
                  <li key={index} className="flex items-center justify-between py-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={pricePoint.name}
                        onChange={(e) => handlePricePointChange(index, 'name', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        value={pricePoint.price}
                        onChange={(e) => handlePricePointChange(index, 'price', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        value={pricePoint.features.join(', ')}
                        onChange={(e) => handlePricePointChange(index, 'features', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePricePoint(index)}
                      className="text-red-600 hover:text-teal-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700">
              Target Audience
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="target_audience"
                id="target_audience"
                value={formData.target_audience}
                onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="competitive_advantage" className="block text-sm font-medium text-gray-700">
              Competitive Advantage
            </label>
            <div className="mt-1">
              <textarea
                id="competitive_advantage"
                name="competitive_advantage"
                rows={3}
                value={formData.competitive_advantage}
                onChange={(e) => setFormData(prev => ({ ...prev, competitive_advantage: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="development_stage" className="block text-sm font-medium text-gray-700">
              Development Stage
            </label>
            <div className="mt-1">
              <select
                id="development_stage"
                name="development_stage"
                value={formData.development_stage}
                onChange={(e) => setFormData(prev => ({ ...prev, development_stage: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              >
                <option value="">Select stage</option>
                <option value="concept">Concept</option>
                <option value="development">In Development</option>
                <option value="beta">Beta</option>
                <option value="launched">Launched</option>
                <option value="mature">Mature</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="launch_date" className="block text-sm font-medium text-gray-700">
              Launch Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="launch_date"
                id="launch_date"
                value={formData.launch_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, launch_date: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="documentation_url" className="block text-sm font-medium text-gray-700">
              Documentation URL
            </label>
            <div className="mt-1">
              <input
                type="url"
                name="documentation_url"
                id="documentation_url"
                value={formData.documentation_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, documentation_url: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-coral-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
