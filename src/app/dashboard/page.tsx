'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

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
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back to your marketing command center</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-coral-300 transition-colors">
            <span className="text-2xl mb-2 block">🚀</span>
            <h3 className="font-medium">Create Campaign</h3>
            <p className="text-sm text-gray-500">Launch a new marketing campaign</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-coral-300 transition-colors">
            <span className="text-2xl mb-2 block">📊</span>
            <h3 className="font-medium">View Analytics</h3>
            <p className="text-sm text-gray-500">Check your performance metrics</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-coral-300 transition-colors">
            <span className="text-2xl mb-2 block">✏️</span>
            <h3 className="font-medium">Create Content</h3>
            <p className="text-sm text-gray-500">Draft new marketing content</p>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-coral-500">
            <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">3</p>
            <p className="text-sm text-green-600 mt-2">↑ 2 new this week</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-coral-500">
            <h3 className="text-sm font-medium text-gray-500">Total Reach</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">12.5k</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-coral-500">
            <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">4.2%</p>
            <p className="text-sm text-green-600 mt-2">↑ 0.5% increase</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-coral-500">
            <h3 className="text-sm font-medium text-gray-500">ROI</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">2.8x</p>
            <p className="text-sm text-green-600 mt-2">↑ 0.3x increase</p>
          </div>
        </div>

        {/* Recent Activity & Upcoming Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <span className="mr-3">{activity.icon}</span>
                      <div>
                        <p className="text-gray-600">{activity.text}</p>
                        <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-100">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">{task.text}</p>
                        <p className="text-sm text-gray-400 mt-1">Due: {task.due}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
