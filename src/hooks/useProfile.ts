import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export interface Profile {
  id: string;
  full_name: string | undefined;
  avatar_url: string | undefined;
  created_at: string;
  updated_at: string;
}

export function useProfile(userId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, check if the profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              full_name: undefined,
              avatar_url: undefined,
              updated_at: new Date().toISOString(),
            }])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else if (fetchError) {
          throw fetchError;
        } else {
          setProfile(existingProfile);
        }
      } catch (e) {
        const error = e as Error;
        console.error('Error loading user profile:', error.message);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, supabase]);

  return { profile, isLoading, error };
}