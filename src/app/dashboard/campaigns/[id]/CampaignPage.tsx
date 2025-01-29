'use client';

import React, { Suspense } from 'react';
import CampaignDetailClient from './CampaignDetailClient';

interface PageProps {
  campaignId: string;
}

export default function CampaignPageContent({ campaignId }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <CampaignDetailClient campaignId={campaignId} />
        </Suspense>
      </div>
    </div>
  );
}
