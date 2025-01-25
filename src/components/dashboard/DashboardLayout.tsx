'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: RocketLaunchIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Marketing Architecture', href: '/dashboard/architecture', icon: BuildingLibraryIcon },
  { name: 'Content', href: '/dashboard/content', icon: DocumentTextIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  return (
    <div className="flex h-full">
      {/* Sidebar for desktop */}
      <div className={`fixed inset-y-0 flex flex-col bg-white border-r border-gray-200 ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-3">
            <div className="flex-shrink-0">
              <Image
                src="/images/margo-logo.svg"
                alt="Margo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto p-1.5 rounded-md hover:bg-gray-100"
            >
              {isCollapsed ? (
                <ChevronDoubleRightIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        
          <div className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  } px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'text-coral bg-coral/10'
                      : 'text-gray-600 hover:text-coral hover:bg-gray-50'
                  }`}
                >
                  <item.icon
                    className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`}
                    aria-hidden="true"
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* User profile and sign out */}
          <div className="border-t border-gray-200 p-4">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-4`}>
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-coral hover:bg-gray-50`}
            >
              <ArrowRightOnRectangleIcon
                className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`}
                aria-hidden="true"
              />
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'} pt-5`}>
        <main className="px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
