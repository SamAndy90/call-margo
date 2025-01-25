'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
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

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  if (!mounted || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Business Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back to your marketing command center
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative group">
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-coral-500 transition-colors">
              <div className="w-8 h-8 mb-2">
                <RocketLaunchIcon className="text-coral-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Create Campaign</h3>
              <p className="mt-1 text-sm text-gray-500">Launch a new marketing campaign</p>
            </div>
            <Link href="/dashboard/campaigns/new" className="absolute inset-0">
              <span className="sr-only">Create Campaign</span>
            </Link>
          </div>

          <div className="relative group">
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-coral-500 transition-colors">
              <div className="w-8 h-8 mb-2">
                <ChartBarIcon className="text-coral-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">View Analytics</h3>
              <p className="mt-1 text-sm text-gray-500">Check your performance metrics</p>
            </div>
            <Link href="/dashboard/analytics" className="absolute inset-0">
              <span className="sr-only">View Analytics</span>
            </Link>
          </div>

          <div className="relative group">
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-coral-500 transition-colors">
              <div className="w-8 h-8 mb-2">
                <PencilIcon className="text-coral-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Create Content</h3>
              <p className="mt-1 text-sm text-gray-500">Draft new marketing content</p>
            </div>
            <Link href="/dashboard/content/new" className="absolute inset-0">
              <span className="sr-only">Create Content</span>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">3</p>
            <p className="mt-1 text-sm text-green-600">+2 new this week</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Reach</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">12.5k</p>
            <p className="mt-1 text-sm text-green-600">+1.8% from last month</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">4.2%</p>
            <p className="mt-1 text-sm text-green-600">+0.5% increase</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-500">ROI</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">2.8x</p>
            <p className="mt-1 text-sm text-green-600">+0.3x increase</p>
          </div>
        </div>

        {/* Recent Activity & Upcoming Tasks */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-2 space-y-3">
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
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Tasks</h3>
            <div className="mt-2 space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-5 w-5 text-coral-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{task.text}</p>
                      <span className={`inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Due: {task.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
