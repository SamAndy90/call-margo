"use client";

import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FormField } from "@/components/Forms/FormField";
import ListField from "@/components/Forms/ListField";
import { Product, PricePoint } from "@/types/product";

interface Props {
  product: Product;
  onProductChange: (
    field: keyof Product,
    value: Product[keyof Product]
  ) => void;
  onAddNote: (data: { title: string; content: string }) => void;
}

const defaultAudiences = [
  { id: "1", name: "Small Business Owners", selected: false },
  { id: "2", name: "Marketing Professionals", selected: false },
  { id: "3", name: "Startup Founders", selected: false },
  { id: "4", name: "Enterprise Companies", selected: false },
  { id: "5", name: "Freelancers", selected: false },
  { id: "6", name: "E-commerce Businesses", selected: false },
];

export default function ProductDetails({
  product,
  onProductChange,
  onAddNote,
}: Props) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });
  const [selectedAudiences, setSelectedAudiences] = useState(
    defaultAudiences.map((audience) => ({
      ...audience,
      selected: product.audience_ids.includes(audience.id),
    }))
  );

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote(newNote);
    setNewNote({ title: "", content: "" });
    setShowNoteForm(false);
  };

  const handleAudienceChange = (audienceId: string) => {
    setSelectedAudiences(
      selectedAudiences.map((audience) =>
        audience.id === audienceId
          ? { ...audience, selected: !audience.selected }
          : audience
      )
    );
    const newAudiences = selectedAudiences
      .filter((a) => a.selected)
      .map((a) => a.id);
    onProductChange("audience_ids", newAudiences);
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Basic Information
          </h3>
          <button
            type="button"
            onClick={() => {
              const newAudiences = [...product.audience_ids, ""];
              onProductChange("audience_ids", newAudiences);
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
              onChange={(value: string) => onProductChange("name", value)}
            />
          </div>

          <div className="sm:col-span-6">
            <FormField
              id="description"
              label="Description"
              value={product.description}
              onChange={(value: string) =>
                onProductChange("description", value)
              }
              type="textarea"
            />
          </div>

          <div className="sm:col-span-6">
            <FormField
              id="value-proposition"
              label="Value Proposition"
              value={product.value_proposition}
              onChange={(value: string) =>
                onProductChange("value_proposition", value)
              }
              type="textarea"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Target Audiences
            </label>
            <div className="mt-1">
              {selectedAudiences.map((audience) => (
                <label
                  key={audience.id}
                  className="inline-flex items-center mr-4 mt-2"
                >
                  <input
                    type="checkbox"
                    checked={audience.selected}
                    onChange={() => handleAudienceChange(audience.id)}
                    className="rounded border-gray-300 text-[#D06E63] focus:ring-[#D06E63]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {audience.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market & Features */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Market & Features
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <ListField
              label="Target Market"
              values={product.target_market}
              onChange={(values: string[]) =>
                onProductChange("target_market", values)
              }
              placeholder="Add target market segment..."
            />
          </div>

          <div className="sm:col-span-6">
            <ListField
              label="Problems Solved"
              values={product.problems_solved}
              onChange={(values: string[]) =>
                onProductChange("problems_solved", values)
              }
              placeholder="Add a problem..."
            />
          </div>

          <div className="sm:col-span-6">
            <ListField
              label="Key Features"
              values={product.key_features}
              onChange={(values: string[]) =>
                onProductChange("key_features", values)
              }
              placeholder="Add a feature..."
            />
          </div>

          <div className="sm:col-span-6">
            <ListField
              label="Benefits"
              values={product.benefits}
              onChange={(values: string[]) =>
                onProductChange("benefits", values)
              }
              placeholder="Add a benefit..."
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Pricing Tiers
          </h3>
          <button
            type="button"
            onClick={() => {
              const newPricePoint: PricePoint = {
                id: crypto.randomUUID(),
                name: "",
                price: "",
                features: [],
              };
              const newPricePoints = [...product.price_points, newPricePoint];
              onProductChange("price_points", newPricePoints);
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
                    onChange={(value: string) => {
                      const newPricePoints = [...product.price_points];
                      newPricePoints[index] = { ...pricePoint, name: value };
                      onProductChange("price_points", newPricePoints);
                    }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    id={`price-point-price-${index}`}
                    label="Price"
                    value={pricePoint.price}
                    onChange={(value: string) => {
                      const newPricePoints = [...product.price_points];
                      newPricePoints[index] = { ...pricePoint, price: value };
                      onProductChange("price_points", newPricePoints);
                    }}
                  />
                </div>

                <div className="sm:col-span-6">
                  <ListField
                    label="Features"
                    values={pricePoint.features}
                    onChange={(values: string[]) => {
                      const newPricePoints = [...product.price_points];
                      newPricePoints[index] = {
                        ...pricePoint,
                        features: values,
                      };
                      onProductChange("price_points", newPricePoints);
                    }}
                    placeholder="Add a feature..."
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newPricePoints = product.price_points.filter(
                      (_, i) => i !== index
                    );
                    onProductChange("price_points", newPricePoints);
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
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Notes
            </h3>
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
                onChange={(value: string) =>
                  setNewNote({ ...newNote, title: value })
                }
              />
              <FormField
                id="note-content"
                label="Content"
                value={newNote.content}
                onChange={(value: string) =>
                  setNewNote({ ...newNote, content: value })
                }
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
          <ul className="-mb-8">{/* Add notes here */}</ul>
        </div>
      </div>
    </div>
  );
}
