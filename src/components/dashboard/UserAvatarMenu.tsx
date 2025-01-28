'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface UserAvatarMenuProps {
  user: User;
}

export default function UserAvatarMenu({ user }: UserAvatarMenuProps) {
  const { signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  
  const getInitials = () => {
    const name = profile?.full_name || user.user_metadata?.name;
    if (name) {
      return name[0].toUpperCase();
    }
    return user.email?.[0].toUpperCase() || 'U';
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500">
        <div className="h-8 w-8 rounded-full bg-coral/10 flex items-center justify-center">
          <span className="text-coral font-medium text-sm">
            {getInitials()}
          </span>
        </div>
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
        <Menu.Items className="absolute bottom-full left-0 mb-1 w-48 origin-bottom-left bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/dashboard/profile"
                className={`${
                  active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                } flex items-center px-4 py-2 text-sm`}
              >
                <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                Profile Settings
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut()}
                className={`${
                  active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                } flex w-full items-center px-4 py-2 text-sm`}
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
