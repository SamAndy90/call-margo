'use client';

import { Suspense } from 'react';
import CampaignDetailClient from './CampaignDetailClient';
import { useParams } from 'next/navigation';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params?.id as string;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Campaign Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CampaignDetailClient campaignId={campaignId} />
      </Suspense>
    </div>
  );
}
