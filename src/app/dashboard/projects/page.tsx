import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import ProjectsClient from './ProjectsClient';
import type { Database } from '@/types/supabase';

export default async function ProjectsPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/signin');
  }

  return <ProjectsClient user={user} />;
}
