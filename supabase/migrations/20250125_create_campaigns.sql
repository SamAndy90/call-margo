-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    growth_plan_id UUID REFERENCES public.growth_plans(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    objective TEXT NOT NULL,
    target_audience_ids UUID[] DEFAULT array[]::UUID[],
    channels JSONB[] DEFAULT array[]::JSONB[],
    budget DECIMAL,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'draft',
    metrics JSONB[] DEFAULT array[]::JSONB[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own campaigns
CREATE POLICY "Users can view their own campaigns"
    ON public.campaigns
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own campaigns
CREATE POLICY "Users can create their own campaigns"
    ON public.campaigns
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own campaigns
CREATE POLICY "Users can update their own campaigns"
    ON public.campaigns
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own campaigns
CREATE POLICY "Users can delete their own campaigns"
    ON public.campaigns
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS campaigns_user_id_idx ON public.campaigns(user_id);

-- Create index on growth_plan_id for faster joins
CREATE INDEX IF NOT EXISTS campaigns_growth_plan_id_idx ON public.campaigns(growth_plan_id);
