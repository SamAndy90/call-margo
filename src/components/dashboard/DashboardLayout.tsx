'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: '📊' },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: '🎯' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { name: 'Audience', href: '/dashboard/audience', icon: '👥' },
  { name: 'Content', href: '/dashboard/content', icon: '📝' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Remove any inline styles that might cause hydration issues
    const root = document.documentElement;
    root.style.removeProperty('--ro-scrollbar-height');
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
            <div className="w-full px-2">
              <img 
                src="http://cdn.mcauto-images-production.sendgrid.net/93d624ba180cb50a/e265a9e5-00d7-4a90-b94a-ec569233f8f8/1000x273.png" 
                alt="Margo"
                className="w-full h-5 object-contain"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-coral-50 text-coral-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-shrink-0 p-4 border-t">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-coral-100 flex items-center justify-center">
                    <span className="text-coral-600 text-sm">👤</span>
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
          <div className="flex h-16 flex-shrink-0 items-center justify-center px-4 border-b">
            <div className="w-full px-2">
              <img 
                src="http://cdn.mcauto-images-production.sendgrid.net/93d624ba180cb50a/e265a9e5-00d7-4a90-b94a-ec569233f8f8/1000x273.png" 
                alt="Margo"
                className="w-full h-5 object-contain"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-coral-50 text-coral-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
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
          className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-coral-500"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {sidebarOpen ? '✕' : '☰'}
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
