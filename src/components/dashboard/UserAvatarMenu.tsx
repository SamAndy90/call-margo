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
<<<<<<< HEAD
import { Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
=======

interface UserAvatarMenuProps {
  user: User | null;
  isCollapsed: boolean;
}
>>>>>>> ui27

export default function UserAvatarMenu({ user, isCollapsed }: UserAvatarMenuProps) {
  const { signOut } = useAuth();
  const { profile } = useProfile(user?.id);

  if (!user) return null;

  return (
    <div className="border-t border-gray-200">
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-coral/10 flex items-center justify-center">
              <span className="text-coral font-medium text-sm">
                {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
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
          } bottom-full mb-1 w-56 origin-bottom-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/dashboard/profile"
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
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
