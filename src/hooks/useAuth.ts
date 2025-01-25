import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAuth() {
  const signIn = useCallback(async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    return supabase.auth.signUp({
      email,
      password,
    });
  }, []);

  const signOut = useCallback(async () => {
    return supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
  }, []);

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
