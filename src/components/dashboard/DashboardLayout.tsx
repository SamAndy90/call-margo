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
    <div>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-gray-900/80 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'w-16 lg:w-16' : 'w-56 lg:w-56'}`}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src={isCollapsed ? "/images/margo-icon.svg" : "/images/margo-logo.svg"}
                alt="Margo"
                width={isCollapsed ? 24 : 100}
                height={isCollapsed ? 24 : 32}
                priority
                className="object-contain"
              />
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center h-6 w-6 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronDoubleRightIcon className="h-4 w-4" />
              ) : (
                <ChevronDoubleLeftIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-4">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6
                            ${isActive
                              ? 'bg-gray-50 text-coral-600'
                              : 'text-gray-700 hover:text-coral-600 hover:bg-gray-50'
                            }
                          `}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 ${
                              isActive ? 'text-coral-600' : 'text-gray-400 group-hover:text-coral-600'
                            }`}
                            aria-hidden="true"
                          />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="/dashboard/settings/profile"
                  className={`
                    group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6
                    ${pathname === '/dashboard/settings/profile'
                      ? 'bg-gray-50 text-coral-600'
                      : 'text-gray-700 hover:text-coral-600 hover:bg-gray-50'
                    }
                  `}
                  title={isCollapsed ? "Profile Settings" : undefined}
                >
                  {user?.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-100 text-xs font-medium text-coral-600">
                      {userInitials}
                    </div>
                  )}
                  {!isCollapsed && (
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-700">
                        {user?.user_metadata?.full_name || user?.email}
                      </p>
                      <p className="text-xs text-gray-500">View profile</p>
                    </div>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`${isCollapsed ? 'lg:pl-16' : 'lg:pl-56'}`}>
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
