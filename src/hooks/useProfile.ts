import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import type { Database } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    let ignore = false;

    async function getProfile() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        if (!ignore) setProfile(data);
      } catch (error) {
        if (error instanceof PostgrestError) {
          toast.error(error.message);
        } else {
          toast.error('Error loading profile');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    }

    getProfile();

    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setProfile(null);
          } else {
            setProfile(payload.new as Profile);
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      channel.unsubscribe();
    };
  }, [userId, supabase]);

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      if (error instanceof PostgrestError) {
        toast.error(error.message);
      } else {
        toast.error('Error updating profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, isFetching, updateProfile };
}
