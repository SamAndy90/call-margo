'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Props {
  children: React.ReactNode;
}

export default function RouteProtection({ children }: Props) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/signin');
      }
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  return <>{children}</>;
}
