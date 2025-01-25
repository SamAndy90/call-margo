import React, { useState } from 'react';
import FormField from '@/components/forms/FormField';

interface VoiceOfCustomerData {
  title: string;
  quote: string;
  customer_name: string;
  customer_title: string;
}

interface Props {
  onSubmit: (data: VoiceOfCustomerData) => void;
  onCancel: () => void;
}

export default function VoiceOfCustomerForm({ onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<VoiceOfCustomerData>({
    title: '',
    quote: '',
    customer_name: '',
    customer_title: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof VoiceOfCustomerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <FormField
        label="Title"
        id="voc-title"
        value={formData.title}
        onChange={(value) => handleChange('title', value)}
      />
      <FormField
        label="Quote"
        id="voc-quote"
        type="textarea"
        value={formData.quote}
        onChange={(value) => handleChange('quote', value)}
      />
      <FormField
        label="Customer Name"
        id="voc-customer-name"
        value={formData.customer_name}
        onChange={(value) => handleChange('customer_name', value)}
      />
      <FormField
        label="Customer Title"
        id="voc-customer-title"
        value={formData.customer_title}
        onChange={(value) => handleChange('customer_title', value)}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-coral-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
        >
          Add Voice of Customer
        </button>
      </div>
    </form>
  );
}
