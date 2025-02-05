"use client";

import React, { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ListFieldProps {
  label: string;
  values?: string[] | null;
  id?: string;
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function ListField({
  label,
  values = [],
  id,
  onChange,
  placeholder,
}: ListFieldProps) {
  const [newItem, setNewItem] = useState("");

  // Ensure values is always an array
  const listItems = Array.isArray(values) ? values : [];

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange([...listItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...listItems];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      <div className="space-y-2">
        {/* Input field with add button */}
        <div className="flex gap-2">
          <input
            type="text"
            id={id}
            name={id}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
            placeholder={placeholder || `Add ${label.toLowerCase()}`}
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center rounded-md border border-transparent bg-coral-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* List of items */}
        <div className="space-y-2">
          {listItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2"
            >
              <span className="flex-grow text-sm text-gray-700">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="invisible group-hover:visible inline-flex items-center rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          {listItems.length === 0 && (
            <div className="text-center py-3 text-sm text-gray-500">
              No {label.toLowerCase()} added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
