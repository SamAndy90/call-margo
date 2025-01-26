-- Create audience_profiles table
CREATE TABLE IF NOT EXISTS public.audience_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    problems JSONB,
    product_solutions JSONB,
    attraction_channels TEXT[],
    engagement_channels TEXT[],
    most_valuable_segments TEXT[],
    common_objections JSONB,
    common_channels TEXT[],
    trusted_platforms TEXT[],
    complementary_problems TEXT[],
    voice_of_customer JSONB,
    notes JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.audience_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audience profiles"
    ON public.audience_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audience profiles"
    ON public.audience_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audience profiles"
    ON public.audience_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audience profiles"
    ON public.audience_profiles
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.audience_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
