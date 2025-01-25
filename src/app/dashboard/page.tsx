'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';
import { RocketLaunchIcon, ChartBarIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const recentActivities = [
  { text: 'New campaign "Summer Sale" created', time: '2 hours ago', icon: '🎯' },
  { text: 'Email newsletter sent to 1,234 subscribers', time: '4 hours ago', icon: '📧' },
  { text: 'Social media post scheduled for tomorrow', time: '5 hours ago', icon: '📱' },
  { text: 'Analytics report generated', time: 'Yesterday', icon: '📊' },
];

const upcomingTasks = [
  { text: 'Review campaign performance', due: 'Today', priority: 'High' },
  { text: 'Create social media content', due: 'Tomorrow', priority: 'Medium' },
  { text: 'Schedule email newsletter', due: 'Next Week', priority: 'Medium' },
  { text: 'Update marketing strategy', due: 'Next Week', priority: 'Low' },
];

const supabase = createClientComponentClient();

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    setMounted(true);

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  if (!mounted || !user) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Business Dashboard</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Welcome back{user?.email ? `, ${user.email}` : ''}!
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your marketing activities today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/dashboard/campaigns/new"
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <RocketLaunchIcon className="h-8 w-8 text-coral mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Campaign</h3>
              <p className="text-gray-600">Launch a new marketing campaign</p>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <ChartBarIcon className="h-8 w-8 text-coral mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">View Analytics</h3>
              <p className="text-gray-600">Check your performance metrics</p>
            </Link>

            <Link
              href="/dashboard/content/new"
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <PencilIcon className="h-8 w-8 text-coral mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Content</h3>
              <p className="text-gray-600">Draft new marketing content</p>
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Active Campaigns</h3>
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <p className="text-sm text-green-600">+2 new this week</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Total Reach</h3>
              <p className="text-2xl font-semibold text-gray-900">12.5k</p>
              <p className="text-sm text-green-600">+1.8% from last month</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Engagement Rate</h3>
              <p className="text-2xl font-semibold text-gray-900">4.2%</p>
              <p className="text-sm text-green-600">+0.5% increase</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">ROI</h3>
              <p className="text-2xl font-semibold text-gray-900">2.8x</p>
              <p className="text-sm text-green-600">+0.3x increase</p>
            </div>
          </div>

          {/* Recent Activity & Upcoming Tasks */}
          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="h-5 w-5 text-coral-600">{activity.icon}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h3>
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-900 font-medium">{task.text}</p>
                      <p className="text-sm text-gray-500">Due: {task.due}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
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
