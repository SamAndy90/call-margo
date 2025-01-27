import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import type { Database } from '@/types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile(userId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchProfile = async () => {
    try {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      toast.error('Error loading profile');
      return null;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setIsLoading(true);
      if (!userId) throw new Error('No user ID');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      toast.success('Profile updated successfully');
      await fetchProfile();
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
  };
}
