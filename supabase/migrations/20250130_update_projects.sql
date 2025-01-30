BEGIN;

-- Rename due_date to end_date
ALTER TABLE public.projects RENAME COLUMN due_date TO end_date;

-- Add objective and start_date columns
ALTER TABLE public.projects ADD COLUMN objective TEXT;
ALTER TABLE public.projects ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;

-- Add campaign_id column with foreign key constraint
ALTER TABLE public.projects ADD COLUMN campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL;

COMMIT;
