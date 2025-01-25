'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { RocketLaunchIcon, ChartBarIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const recentActivities = [
  { text: 'New campaign "Summer Sale" created', time: '2 hours ago', icon: '🎯' },
  { text: 'Email newsletter sent to 1,234 subscribers', time: '4 hours ago', icon: '📧' },
  { text: 'Social media post scheduled for tomorrow', time: '5 hours ago', icon: '📱' },
  { text: 'Analytics report generated', time: 'Yesterday', icon: '📊' },
];

const quickActions = [
  { name: 'New Campaign', icon: RocketLaunchIcon, href: '/dashboard/campaigns/new' },
  { name: 'Analytics', icon: ChartBarIcon, href: '/dashboard/analytics' },
  { name: 'Edit Content', icon: PencilIcon, href: '/dashboard/content/new' },
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
  }, [router, supabase.auth]);

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
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Main Content Area */}
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h1 className="text-2xl font-semibold">Welcome back{user?.email ? `, ${user.email}` : ''}!</h1>
                  <p className="mt-2 text-gray-600">
                    Here's what's happening with your marketing activities today.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium">Quick Actions</h2>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                      <Link
                        key={action.name}
                        href={action.href}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                      >
                        <action.icon className="h-6 w-6 text-gray-600" />
                        <span className="mt-2 text-sm text-gray-900">{action.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium">Recent Activity</h2>
                  <div className="mt-4 space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
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
      </div>
    </div>
  );
}
