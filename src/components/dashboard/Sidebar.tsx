'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';
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
import UserAvatarMenu from './UserAvatarMenu';
import { useProfile } from '@/hooks/useProfile';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Growth Plan', href: '/dashboard/growth-plan', icon: ChartBarIcon },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: RocketLaunchIcon },
  { name: 'Resources', href: '/dashboard/architecture', icon: BuildingLibraryIcon },
  { name: 'Documentation', href: '/docs', icon: DocumentTextIcon },
];

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { profile } = useProfile(user?.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <div className="fixed top-0 bottom-0 left-0 z-20 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="w-32 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed top-0 bottom-0 left-0 z-20 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2 flex-1">
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
            <span className="text-xl font-semibold text-gray-900 font-poppins truncate">
              OS1
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 ml-2"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-coral-600 bg-coral-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon 
                  className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${
                    isActive ? 'text-coral-600' : 'text-gray-400'
                  }`} 
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Menu */}
      <div className="flex items-center px-4 py-3 border-t border-gray-200">
        <UserAvatarMenu user={user} />
        {!isCollapsed && (
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || user.user_metadata?.name || user.email}
            </p>
            {(profile?.role || user.user_metadata?.role) && (
              <p className="text-xs text-gray-500 truncate">
                {profile?.role || user.user_metadata?.role}
                {profile?.company || user.user_metadata?.company ? ` • ${profile?.company || user.user_metadata?.company}` : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
