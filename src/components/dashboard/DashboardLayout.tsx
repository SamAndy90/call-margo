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
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Clean up any dynamic styles that might cause hydration issues
    const root = document.documentElement;
    root.style.removeProperty('--ro-scrollbar-height');
    
    // Remove Grammarly attributes if they exist
    document.querySelectorAll('[data-gr-ext-installed]').forEach(el => {
      el.removeAttribute('data-gr-ext-installed');
    });
    document.querySelectorAll('[data-new-gr-c-s-check-loaded]').forEach(el => {
      el.removeAttribute('data-new-gr-c-s-check-loaded');
    });
  }, []);

  // Basic skeleton for SSR
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          <div className="hidden md:block w-64 bg-white" />
          <div className="flex-1">
            <main className="py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="flex h-16 flex-shrink-0 items-center justify-center px-4 border-b">
            <div className="relative w-full h-8 px-2">
              <Image 
                src="/images/margo-logo.svg"
                alt="Margo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5">
            <nav className="flex-1 space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-coral-50 text-coral-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-coral-600'
                    }`}
                  >
                    <Icon 
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-coral-600' : 'text-gray-400 group-hover:text-coral-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-shrink-0 p-4 border-t">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-coral-50 flex items-center justify-center">
                    <UserCircleIcon className="h-5 w-5 text-coral-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Business Account</p>
                  <p className="text-xs text-gray-500">Manage Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-40 ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b">
            <div className="relative w-32 h-8">
              <Image 
                src="/images/margo-logo.svg"
                alt="Margo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5">
            <nav className="flex-1 space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-coral-50 text-coral-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-coral-600'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon 
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-coral-600' : 'text-gray-400 group-hover:text-coral-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-30 flex h-16 flex-shrink-0 bg-white md:hidden">
        <button
          type="button"
          className="px-4 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-coral-500"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
