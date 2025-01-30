'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@supabase/supabase-js';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

interface Profile {
  id: string;
  full_name: string | undefined;
  avatar_url: string | undefined;
  created_at: string;
  updated_at: string;
}

interface UserAvatarMenuProps {
  user: User;
  profile?: Profile | null;
  isCollapsed: boolean;
}

export default function UserAvatarMenu({ user, profile, isCollapsed }: UserAvatarMenuProps) {
  const { signOut } = useAuth();
  
  const getInitials = () => {
    const name = profile?.full_name || user.user_metadata?.name;
    if (!name) return '';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  const displayName = profile?.full_name || user.user_metadata?.name || user.email;
  const initials = getInitials();

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button className="flex items-center w-full rounded-md hover:bg-gray-50 px-2 py-1">
        <span className="sr-only">Open user menu</span>
        <div className="relative h-8 w-8 flex-shrink-0">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={displayName}
              className="rounded-full object-cover"
              fill
            />
          ) : initials ? (
            <div className="h-8 w-8 rounded-full bg-coral-100 flex items-center justify-center text-sm font-medium text-coral-600">
              {initials}
            </div>
          ) : (
            <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
          )}
        </div>
        {!isCollapsed && (
          <div className="ml-3 flex-1 flex flex-col items-start">
            <span className="text-sm font-medium text-gray-700 truncate">
              {displayName}
            </span>
            {profile?.full_name && user.email && (
              <span className="text-xs text-gray-500 truncate">
                {user.email}
              </span>
            )}
          </div>
        )}
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
        <Menu.Items className="absolute right-0 bottom-full z-10 mb-2 w-48 origin-bottom-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/dashboard/profile"
                className={clsx(
                  active ? 'bg-gray-50' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
              >
                Profile Settings
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut()}
                className={clsx(
                  active ? 'bg-gray-50' : '',
                  'block w-full text-left px-4 py-2 text-sm text-gray-700'
                )}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
