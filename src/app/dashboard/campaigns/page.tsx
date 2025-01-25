'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';

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
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
          <button className="px-4 py-2 bg-coral text-white rounded-md hover:bg-coral/90">
            Create Campaign
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reach
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaignData.map((campaign, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                            campaign.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.reach}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.engagement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.startDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
