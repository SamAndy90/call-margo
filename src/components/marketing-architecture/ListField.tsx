import React, { useState } from 'react';

interface ListFieldProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export default function ListField({ label, values, onChange }: ListFieldProps) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onChange([...values, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
            placeholder="Add new item"
          />
          <button
            type="submit"
            style={{ backgroundColor: '#d06e63' }}
            className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            Add
          </button>
        </form>
        <ul className="mt-2 space-y-2">
          {values.map((item, index) => (
            <li key={index} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-700">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Remove</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
