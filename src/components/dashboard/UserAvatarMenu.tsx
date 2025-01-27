import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User } from '@supabase/supabase-js';
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

interface UserAvatarMenuProps {
  user: User | null;
  isCollapsed: boolean;
}

export default function UserAvatarMenu({ user, isCollapsed }: UserAvatarMenuProps) {
  const { signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="border-t border-gray-200">
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <UserCircleIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
          {!isCollapsed && (
            <>
              <span className="ml-3 truncate">{user.email}</span>
            </>
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
          <Menu.Items className="absolute bottom-full left-0 w-48 mb-1 origin-bottom-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" aria-hidden="true" />
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
