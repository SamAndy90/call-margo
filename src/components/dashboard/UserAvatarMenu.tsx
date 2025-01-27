'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfile } from '@/hooks/useProfile';
import { Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function UserAvatarMenu({ user, isCollapsed }: { user: User | null; isCollapsed: boolean }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { profile } = useProfile(user?.id);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  if (!user) return null;

  return (
    <div className="border-t border-gray-200 p-4">
      <Menu as="div" className="relative inline-block text-left w-full">
        <Menu.Button className={`w-full flex items-center ${
          isCollapsed ? 'justify-center' : 'space-x-3'
        } rounded-md hover:bg-gray-50 p-2`}>
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-coral/10 flex items-center justify-center">
              <span className="text-coral font-medium text-sm">
                {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || user.email}
              </p>
              {(profile?.role || profile?.company) && (
                <p className="text-xs text-gray-500 truncate">
                  {[profile.role, profile.company].filter(Boolean).join(' • ')}
                </p>
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
          <Menu.Items className={`absolute ${
            isCollapsed ? 'left-16' : 'left-0'
          } bottom-full mb-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/dashboard/profile"
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex items-center px-4 py-2 text-sm`}
                  >
                    <Cog6ToothIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Profile Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleSignOut}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex items-center px-4 py-2 text-sm w-full`}
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
