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
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import UserAvatarMenu from './UserAvatarMenu';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Growth Plan', href: '/growth-plan', icon: ChartBarIcon },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: RocketLaunchIcon },
  { name: 'Resources', href: '/dashboard/architecture', icon: BuildingLibraryIcon },
  { name: 'Documentation', href: '/docs', icon: DocumentTextIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out flex flex-col bg-white border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src="/images/margoicon.svg"
                alt="Margo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-semibold text-gray-900 font-poppins">Margo OS</span>
            )}
          </Link>
          <div className="flex items-center">
            {/* Desktop collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-2 text-gray-500 hover:text-gray-600"
            >
              {isCollapsed ? (
                <ChevronDoubleRightIcon className="w-5 h-5" />
              ) : (
                <ChevronDoubleLeftIcon className="w-5 h-5" />
              )}
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-600"
            >
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-coral/10 text-coral'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0 ${
                    isActive ? 'text-coral' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* User menu */}
        <UserAvatarMenu user={user} isCollapsed={isCollapsed} />
      </div>

      {/* Mobile sidebar toggle */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg text-gray-500 hover:text-gray-600 md:hidden"
        >
          <ChevronDoubleRightIcon className="w-5 h-5" />
        </button>
      )}

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? (isCollapsed ? 'md:pl-16' : 'md:pl-64') : ''
        }`}
      >
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
