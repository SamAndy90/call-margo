-- Create growth_plans table
CREATE TABLE IF NOT EXISTS public.growth_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'draft',
    goals JSONB[] DEFAULT array[]::JSONB[],
    metrics JSONB[] DEFAULT array[]::JSONB[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.growth_plans ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own growth plans
CREATE POLICY "Users can view their own growth plans"
    ON public.growth_plans
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own growth plans
CREATE POLICY "Users can create their own growth plans"
    ON public.growth_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own growth plans
CREATE POLICY "Users can update their own growth plans"
    ON public.growth_plans
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own growth plans
CREATE POLICY "Users can delete their own growth plans"
    ON public.growth_plans
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

CREATE TRIGGER update_growth_plans_updated_at
    BEFORE UPDATE ON public.growth_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
