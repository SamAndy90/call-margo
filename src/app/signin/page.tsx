import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import SignInForm from './SignInForm';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function SignIn() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            className="h-12 w-auto"
            src="/images/margo-logo.svg"
            alt="Margo"
            width={180}
            height={48}
            priority
            style={{ height: 'auto' }}
          />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
