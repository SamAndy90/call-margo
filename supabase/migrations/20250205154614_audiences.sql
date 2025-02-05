-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create audiences table
CREATE TABLE IF NOT EXISTS public.audiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    audience_name TEXT NOT NULL,
    audience_type TEXT NOT NULL,
    description TEXT,
    problems TEXT[],
    product_solutions TEXT[],
    attraction TEXT,
    engagement TEXT,
    common_objections TEXT[],
    common_channels TEXT[],
    trusted_platforms TEXT[],
    complementary_problems TEXT[],
    voc_title TEXT,
    quote TEXT,
    attachment TEXT,
    customer_name TEXT,
    customer_title TEXT,
    customer_comment TEXT,
    screenshot TEXT,
    note_title TEXT DEFAULT '',
    date_stamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add RLS policies for audiences
ALTER TABLE public.audiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audiences_select_policy"
    ON public.audiences
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "audiences_insert_policy"
    ON public.audiences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "audiences_update_policy"
    ON public.audiences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "audiences_delete_policy"
    ON public.audiences
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add updated_at trigger for audiences
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.audiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
