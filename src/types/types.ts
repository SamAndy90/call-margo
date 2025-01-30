import type { Database } from './supabase';

export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'archived';
export type CampaignStage = 'foundation' | 'awareness' | 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
export type CampaignFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type ProjectStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'backlog' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high';
