import React from 'react';

interface Props {
  label: string;
  id: string;
  value?: string | null;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea';
  placeholder?: string;
}

export default function FormField({
  label,
  id,
  value = '',
  onChange,
  type = 'text',
  placeholder,
}: Props) {
  // Always ensure we have a string value
  const inputValue = value === null ? '' : value;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            rows={3}
            className="shadow-sm focus:ring-coral-500 focus:border-coral-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            name={id}
            id={id}
            className="shadow-sm focus:ring-coral-500 focus:border-coral-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
