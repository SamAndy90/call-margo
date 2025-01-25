import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import FormField from '@/components/forms/FormField';
import ListField from '@/components/marketing-architecture/ListField';

interface ProductProfile {
  id?: string;
  user_id?: string;
  name?: string;
  type?: string;
  description?: string;
  value_proposition?: string;
  target_market?: string[];
  problems_solved?: string[];
  key_features?: string[];
  benefits?: string[];
  price_points?: {
    id: string;
    name: string;
    price: string;
    features: string[];
  }[];
  audience_ids?: string[];
  market_category?: string;
  created_at?: Date;
  updated_at?: Date;
  archived?: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductProfile) => void;
  initialProduct?: ProductProfile | null;
}

export default function ProductModal({ isOpen, onClose, onSave, initialProduct }: ProductModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const product: ProductProfile = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      value_proposition: formData.get('value_proposition') as string,
      target_market: (formData.get('target_market') as string).split(',').map(s => s.trim()).filter(Boolean),
      problems_solved: (formData.get('problems_solved') as string).split(',').map(s => s.trim()).filter(Boolean),
      key_features: (formData.get('key_features') as string).split(',').map(s => s.trim()).filter(Boolean),
      benefits: (formData.get('benefits') as string).split(',').map(s => s.trim()).filter(Boolean),
      price_points: [],
      audience_ids: (formData.get('audience_ids') as string).split(',').map(s => s.trim()).filter(Boolean),
      market_category: formData.get('market_category') as string,
    };

    onSave(product);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {initialProduct ? 'Edit Product Profile' : 'Add Product Profile'}
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="space-y-4">
                          <FormField
                            label="Product Name"
                            id="name"
                            name="name"
                            defaultValue={initialProduct?.name || ''}
                            required
                          />
                          <FormField
                            label="Type"
                            id="type"
                            name="type"
                            defaultValue={initialProduct?.type || ''}
                            required
                          />
                          <FormField
                            label="Description"
                            id="description"
                            name="description"
                            type="textarea"
                            defaultValue={initialProduct?.description || ''}
                            required
                          />
                          <FormField
                            label="Value Proposition"
                            id="value_proposition"
                            name="value_proposition"
                            type="textarea"
                            defaultValue={initialProduct?.value_proposition || ''}
                            required
                          />
                          <FormField
                            label="Target Market"
                            id="target_market"
                            name="target_market"
                            type="textarea"
                            defaultValue={initialProduct?.target_market?.join(', ') || ''}
                            required
                          />
                          <FormField
                            label="Problems Solved"
                            id="problems_solved"
                            name="problems_solved"
                            type="textarea"
                            defaultValue={initialProduct?.problems_solved?.join(', ') || ''}
                            required
                          />
                          <FormField
                            label="Key Features"
                            id="key_features"
                            name="key_features"
                            type="textarea"
                            defaultValue={initialProduct?.key_features?.join(', ') || ''}
                            required
                          />
                          <FormField
                            label="Benefits"
                            id="benefits"
                            name="benefits"
                            type="textarea"
                            defaultValue={initialProduct?.benefits?.join(', ') || ''}
                            required
                          />
                          <FormField
                            label="Audience IDs"
                            id="audience_ids"
                            name="audience_ids"
                            type="textarea"
                            defaultValue={initialProduct?.audience_ids?.join(', ') || ''}
                            required
                          />
                          <FormField
                            label="Market Category"
                            id="market_category"
                            name="market_category"
                            defaultValue={initialProduct?.market_category || ''}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
