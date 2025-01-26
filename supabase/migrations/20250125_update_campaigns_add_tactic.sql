-- Add tactic_id to campaigns table
ALTER TABLE public.campaigns
ADD COLUMN tactic_id UUID REFERENCES public.tactics(id),
ADD COLUMN custom_tactic TEXT;
