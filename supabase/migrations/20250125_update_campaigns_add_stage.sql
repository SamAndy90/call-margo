-- Add stage column to campaigns table
ALTER TABLE public.campaigns
ADD COLUMN stage TEXT NOT NULL DEFAULT 'Foundations';

-- Create index on stage for faster queries
CREATE INDEX IF NOT EXISTS campaigns_stage_idx ON public.campaigns(stage);
