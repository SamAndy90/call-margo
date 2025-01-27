import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import type { Database } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string | null;
  company: string | null;
  role: string | null;
  updated_at: string | null;
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching profile:', fetchError);
          return;
        }

        if (!existingProfile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                full_name: '',
                company: '',
                role: '',
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
            return;
          }

          setProfile(newProfile);
        } else {
          setProfile(existingProfile);
        }
      } catch (error) {
        if (error instanceof PostgrestError) {
          console.error('Database error:', error.message);
        } else {
          console.error('Error:', error);
        }
      } finally {
        setIsFetching(false);
      }
    };

    loadProfile();

    // Subscribe to profile changes
    const channel = supabase
      .channel(`profile:${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.new) {
            setProfile(payload.new as Profile);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, supabase]);

  const updateProfile = async (updates: Partial<Profile>) => {
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
