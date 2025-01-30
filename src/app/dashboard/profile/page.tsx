import ProfileForm from './ProfileForm';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Database } from '@/types/supabase';

export default async function ProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Profile Settings</h1>
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}
