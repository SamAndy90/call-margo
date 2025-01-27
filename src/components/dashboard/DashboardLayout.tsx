'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import UserAvatarMenu from './UserAvatarMenu';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: RocketLaunchIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Marketing Architecture', href: '/dashboard/architecture', icon: BuildingLibraryIcon },
  { name: 'Growth Plan', href: '/growth-plan', icon: DocumentTextIcon },
  { name: 'Content', href: '/dashboard/content', icon: DocumentTextIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-full">
      {/* Sidebar for desktop */}
      <div className={`fixed inset-y-0 flex flex-col bg-white border-r border-gray-200 ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4">
            <div className={`flex-shrink-0 ${isCollapsed ? 'hidden' : 'block'}`}>
              <Image
                priority
                className="h-8 w-auto"
                src="/margo-square.svg"
                alt="Margo"
                width={48}
                height={48}
                style={{ width: '48px', height: '48px' }}
              />
            </div>
            <div className={`flex-shrink-0 ${!isCollapsed ? 'hidden' : 'block'}`}>
              <Image
                priority
                className="h-8 w-auto"
                src="/margo-square.svg"
                alt="Margo"
                width={32}
                height={32}
                style={{ width: '32px', height: '32px' }}
              />
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-100"
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
          <UserAvatarMenu user={user} isCollapsed={isCollapsed} />
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
