'use client';

import { useState } from 'react';
import ProductDetails from './ProductDetails';

const initialProduct = {
  id: '',
  name: '',
  description: '',
  value_proposition: '',
  target_market: [],
  problems_solved: [],
  key_features: [],
  benefits: [],
  price_points: [],
  audience_ids: [],
};

export default function MarketingArchitectureContent() {
  const [product, setProduct] = useState(initialProduct);

  const handleProductChange = (field: keyof typeof product, value: any) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Marketing Architecture
        </h2>
        <ProductDetails
          product={product}
          onProductChange={handleProductChange}
          onAddNote={() => {}}
        />
      </div>
    </div>
  );
}
