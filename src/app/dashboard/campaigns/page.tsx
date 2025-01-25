'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const campaignData = [
  {
    name: 'Summer Sale 2025',
    type: 'Email Campaign',
    status: 'Active',
    reach: '5.2k',
    engagement: '12%',
    startDate: 'Jun 1, 2025',
  },
  {
    name: 'Product Launch',
    type: 'Multi-channel',
    status: 'Scheduled',
    reach: '--',
    engagement: '--',
    startDate: 'Jul 15, 2025',
  },
  {
    name: 'Customer Feedback',
    type: 'Email Survey',
    status: 'Draft',
    reach: '--',
    engagement: '--',
    startDate: 'Not set',
  },
  {
    name: 'Spring Collection',
    type: 'Social Media',
    status: 'Completed',
    reach: '8.7k',
    engagement: '15%',
    startDate: 'Mar 1, 2025',
  },
];

export default function Campaigns() {
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
        {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-2">Manage and track your marketing campaigns</p>
          </div>
          <button className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors">
            Create Campaign
          </button>
        </div>

        {/* Campaign Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <select className="px-4 py-2 border rounded-lg">
            <option>All Campaigns</option>
            <option>Active</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Draft</option>
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option>All Types</option>
            <option>Email</option>
            <option>Social Media</option>
            <option>Ads</option>
            <option>Content</option>
          </select>
          <input
            type="text"
            placeholder="Search campaigns..."
            className="px-4 py-2 border rounded-lg flex-grow"
          />
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-100">
            {campaignData.map((campaign, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{campaign.type}</p>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 flex-wrap">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Reach</p>
                      <p className="font-medium">{campaign.reach}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Engagement</p>
                      <p className="font-medium">{campaign.engagement}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{campaign.startDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      campaign.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm text-gray-500">Showing 1-4 of 12 campaigns</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
