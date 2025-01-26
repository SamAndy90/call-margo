'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  PencilIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const dashboardTiles = [
  { 
    name: 'Marketing Architecture', 
    icon: BuildingOfficeIcon, 
    href: '/marketing-architecture',
    description: 'Define your product, audience, and channels',
    color: 'bg-blue-50 hover:bg-blue-100',
    stats: 'Last updated 2 hours ago'
  },
  { 
    name: 'Audience Profiles', 
    icon: UserGroupIcon, 
    href: '/audience-profiles',
    description: 'Manage and analyze your target audiences',
    color: 'bg-purple-50 hover:bg-purple-100',
    stats: '3 active profiles'
  },
  { 
    name: 'Content Creation', 
    icon: DocumentTextIcon, 
    href: '/content',
    description: 'Create and manage marketing content',
    color: 'bg-green-50 hover:bg-green-100',
    stats: '12 pieces created'
  },
  { 
    name: 'Campaigns', 
    icon: MegaphoneIcon, 
    href: '/campaigns',
    description: 'Plan and execute marketing campaigns',
    color: 'bg-yellow-50 hover:bg-yellow-100',
    stats: '2 active campaigns'
  },
  { 
    name: 'Analytics', 
    icon: ChartBarIcon, 
    href: '/analytics',
    description: 'Track and analyze performance metrics',
    color: 'bg-pink-50 hover:bg-pink-100',
    stats: 'Updated live'
  },
  { 
    name: 'Customer Feedback', 
    icon: ChatBubbleLeftRightIcon, 
    href: '/feedback',
    description: 'Collect and analyze customer feedback',
    color: 'bg-indigo-50 hover:bg-indigo-100',
    stats: '24 new responses'
  }
];

const recentActivities = [
  { text: 'New campaign "Summer Sale" created', time: '2 hours ago', icon: '🎯' },
  { text: 'Email newsletter sent to 1,234 subscribers', time: '4 hours ago', icon: '📧' },
  { text: 'Social media post scheduled for tomorrow', time: '5 hours ago', icon: '📱' },
  { text: 'Analytics report generated', time: 'Yesterday', icon: '📊' },
];

const quickStats = [
  { name: 'Total Audience', value: '12.5k', change: '+12%', trend: 'up' },
  { name: 'Engagement Rate', value: '4.3%', change: '+0.8%', trend: 'up' },
  { name: 'Content Pieces', value: '45', change: '+5', trend: 'up' },
  { name: 'Active Campaigns', value: '3', change: '0', trend: 'neutral' },
];

const supabase = createClientComponentClient();

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error getting user:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen">
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Here's your marketing command center. What would you like to work on today?
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat) => (
              <div
                key={stat.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                <dd className="mt-1">
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'down' ? 'text-red-600' : 
                      'text-gray-500'
                    }`}>
                      {stat.change}
                      {stat.trend === 'up' && (
                        <ArrowTrendingUpIcon className="h-4 w-4 ml-0.5" />
                      )}
                    </p>
                  </div>
                </dd>
              </div>
            ))}
          </div>

          {/* Dashboard Tiles */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardTiles.map((tile) => (
              <Link
                key={tile.name}
                href={tile.href}
                className={`group relative overflow-hidden rounded-xl ${tile.color} p-6 transition duration-200 ease-in-out`}
              >
                <div className="flex items-center space-x-4">
                  <tile.icon className="h-8 w-8 text-gray-700" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{tile.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{tile.description}</p>
                    <p className="mt-2 text-sm font-medium text-gray-500">{tile.stats}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 py-4 first:pt-0 last:pb-0">
                    <span className="text-2xl">{activity.icon}</span>
                    <div>
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
