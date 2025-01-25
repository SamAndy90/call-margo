import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default async function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({
    cookies: () => cookies()
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}
