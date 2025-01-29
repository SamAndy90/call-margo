import { Database } from './supabase';

export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type Tactic = Database['public']['Tables']['tactics']['Row'];
export type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'archived';
export type CampaignStage = 'foundation' | 'awareness' | 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
export type CampaignFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
