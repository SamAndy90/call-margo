import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/signin');
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </DashboardLayout>
  );
}
