'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import CampaignCard from '@/components/growth-plan/CampaignCard';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface CampaignsClientProps {
  initialCampaigns: Campaign[];
}

export default function CampaignsClient({ initialCampaigns }: CampaignsClientProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const handleCreateCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCampaigns((prev) => [data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center rounded-md bg-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral/90"
        >
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      <CreateCampaignModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
    </>
  );
}
