"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import UserAvatarMenu from "./UserAvatarMenu";
import {
  HomeIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  // RocketLaunchIcon,
  // ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { User } from "@supabase/supabase-js";
import { DashboardUrls } from "@/route-urls";

const navigation = [
  { name: "Dashboard", href: DashboardUrls._getRoot(), icon: HomeIcon },
  {
    name: "Architecture",
    href: DashboardUrls.getArchitecture(),
    icon: HomeIcon,
  },
  {
    name: "Growth Plan",
    href: DashboardUrls.getGrowthPlan(),
    icon: ChartBarIcon,
  },
  {
    name: "Analytics",
    href: DashboardUrls.getAnalytics(),
    icon: BuildingLibraryIcon,
  },
  { name: "Library", href: DashboardUrls.getLibrary(), icon: DocumentTextIcon },
  {
    name: "Marketplace",
    href: DashboardUrls.getMarketplace(),
    icon: DocumentTextIcon,
  },
  // { name: "Campaigns", href: "/dashboard/campaigns", icon: RocketLaunchIcon },
  // {
  //   name: "Projects",
  //   href: "/dashboard/projects",
  //   icon: ClipboardDocumentListIcon,
  // },
];

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { profile } = useProfile(user?.id);

  if (!user) return null;

  return (
    <>
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 flex-1"
          >
            <div className="relative w-8 h-8">
              <Image
                src="/images/margoicon.svg"
                alt="OS1"
                fill
                className="object-contain"
                priority
              />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-semibold text-gray-900 truncate">
                OS1
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100"
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
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    isActive
                      ? "bg-coral-50 text-coral-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                  )}
                >
                  <item.icon
                    className={clsx(
                      isActive
                        ? "text-coral-600"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User menu */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="w-full">
            <UserAvatarMenu
              user={user}
              profile={profile}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "z-0 transition-all duration-300 pointer-events-none",
          isCollapsed ? "w-16" : "w-64"
        )}
      ></div>
    </>
  );
}
