'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: RocketLaunchIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Marketing Architecture', href: '/dashboard/architecture', icon: BuildingLibraryIcon },
  { name: 'Content', href: '/dashboard/content', icon: DocumentTextIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const userInitials = getInitials(user?.user_metadata?.full_name || user?.email);

  return (
    <div className="flex h-full">
      {/* Sidebar for desktop */}
      <div className={`fixed inset-y-0 flex flex-col bg-white border-r border-gray-200 pt-14 ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-end px-2 py-1">
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
