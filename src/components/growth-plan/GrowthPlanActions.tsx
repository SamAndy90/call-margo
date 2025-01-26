'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import EditGrowthPlanModal from './EditGrowthPlanModal';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

interface GrowthPlanActionsProps {
  growthPlan: GrowthPlan;
  onUpdate: () => void;
}

export default function GrowthPlanActions({ growthPlan, onUpdate }: GrowthPlanActionsProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleArchive = async () => {
    try {
      const { error } = await supabase
        .from('growth_plans')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', growthPlan.id);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error archiving growth plan:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this growth plan? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      // First, delete associated campaigns
      const { error: campaignsError } = await supabase
        .from('campaigns')
        .delete()
        .eq('growth_plan_id', growthPlan.id);

      if (campaignsError) throw campaignsError;

      // Then delete the growth plan
      const { error: planError } = await supabase
        .from('growth_plans')
        .delete()
        .eq('id', growthPlan.id);

      if (planError) throw planError;

      router.push('/dashboard/growth-plans');
    } catch (error) {
      console.error('Error deleting growth plan:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className={`${
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <PencilSquareIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Edit
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleArchive}
                    className={`${
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm`}
                    disabled={growthPlan.status === 'archived'}
                  >
                    <ArchiveBoxIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Archive
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`${
                      active ? 'bg-red-50 text-red-900' : 'text-red-700'
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <TrashIcon className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <EditGrowthPlanModal
        growthPlan={growthPlan}
        open={editModalOpen}
        setOpen={setEditModalOpen}
        onUpdate={onUpdate}
      />
    </>
  );
}
