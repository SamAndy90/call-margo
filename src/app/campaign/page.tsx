import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CampaignCard from '@/components/growth-plan/CampaignCard';
import CreateCampaignModal from '@/components/growth-plan/CreateCampaignModal';

export default async function CampaignPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
        <CreateCampaignModal />
      </div>
      
      <Suspense fallback={<LoadingSpinner />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
