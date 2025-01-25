-- Create tables
CREATE TABLE IF NOT EXISTS brand_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    brand_name TEXT,
    tagline TEXT,
    values TEXT,
    voice_tone TEXT,
    visual_identity TEXT,
    color_palette TEXT,
    typography TEXT,
    logo_usage TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS competitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    strengths TEXT[],
    weaknesses TEXT[],
    key_differentiators TEXT[],
    website TEXT,
    has_newsletter BOOLEAN DEFAULT false,
    social_accounts JSONB DEFAULT '{}'::jsonb,
    other_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS market_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    industry TEXT,
    market_category TEXT,
    key_players TEXT,
    company_advantages TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS audience_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    problems TEXT[],
    product_solutions TEXT[],
    attraction_channels TEXT[],
    engagement_channels TEXT[],
    valuable_segments TEXT,
    common_objections TEXT[],
    common_channels TEXT[],
    trusted_platforms TEXT[],
    complementary_problems TEXT[],
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS voice_of_customer (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    audience_profile_id UUID NOT NULL REFERENCES audience_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    quote TEXT NOT NULL,
    customer_name TEXT,
    customer_title TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS audience_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    audience_profile_id UUID NOT NULL REFERENCES audience_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE brand_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_of_customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own brand data" ON brand_data;
DROP POLICY IF EXISTS "Users can create their own brand data" ON brand_data;
DROP POLICY IF EXISTS "Users can update their own brand data" ON brand_data;
DROP POLICY IF EXISTS "Users can delete their own brand data" ON brand_data;

DROP POLICY IF EXISTS "Users can view their own competitors" ON competitors;
DROP POLICY IF EXISTS "Users can create their own competitors" ON competitors;
DROP POLICY IF EXISTS "Users can update their own competitors" ON competitors;
DROP POLICY IF EXISTS "Users can delete their own competitors" ON competitors;

DROP POLICY IF EXISTS "Users can view their own market data" ON market_data;
DROP POLICY IF EXISTS "Users can create their own market data" ON market_data;
DROP POLICY IF EXISTS "Users can update their own market data" ON market_data;
DROP POLICY IF EXISTS "Users can delete their own market data" ON market_data;

DROP POLICY IF EXISTS "Users can view their own audience profiles" ON audience_profiles;
DROP POLICY IF EXISTS "Users can create their own audience profiles" ON audience_profiles;
DROP POLICY IF EXISTS "Users can update their own audience profiles" ON audience_profiles;
DROP POLICY IF EXISTS "Users can delete their own audience profiles" ON audience_profiles;

DROP POLICY IF EXISTS "Users can view VOC for their audience profiles" ON voice_of_customer;
DROP POLICY IF EXISTS "Users can create VOC for their audience profiles" ON voice_of_customer;
DROP POLICY IF EXISTS "Users can update VOC for their audience profiles" ON voice_of_customer;
DROP POLICY IF EXISTS "Users can delete VOC for their audience profiles" ON voice_of_customer;

DROP POLICY IF EXISTS "Users can view notes for their audience profiles" ON audience_notes;
DROP POLICY IF EXISTS "Users can create notes for their audience profiles" ON audience_notes;
DROP POLICY IF EXISTS "Users can update notes for their audience profiles" ON audience_notes;
DROP POLICY IF EXISTS "Users can delete notes for their audience profiles" ON audience_notes;

-- Create policies
CREATE POLICY "Users can view their own brand data" ON brand_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own brand data" ON brand_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brand data" ON brand_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brand data" ON brand_data FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own competitors" ON competitors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own competitors" ON competitors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own competitors" ON competitors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own competitors" ON competitors FOR DELETE USING (auth.uid() = user_id);

-- Market data policies with explicit permissions
CREATE POLICY "Users can view their own market data" ON market_data 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own market data" ON market_data 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own market data" ON market_data 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own market data" ON market_data 
    FOR DELETE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own audience profiles" ON audience_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own audience profiles" ON audience_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own audience profiles" ON audience_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own audience profiles" ON audience_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view VOC for their audience profiles" ON voice_of_customer 
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = voice_of_customer.audience_profile_id
        AND ap.user_id = auth.uid()
    ));

CREATE POLICY "Users can create VOC for their audience profiles" ON voice_of_customer 
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = audience_profile_id
        AND ap.user_id = auth.uid()
    ));

CREATE POLICY "Users can update VOC for their audience profiles" ON voice_of_customer 
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = voice_of_customer.audience_profile_id
        AND ap.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete VOC for their audience profiles" ON voice_of_customer 
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = voice_of_customer.audience_profile_id
        AND ap.user_id = auth.uid()
    ));

CREATE POLICY "Users can view notes for their audience profiles" ON audience_notes 
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = audience_notes.audience_profile_id
        AND ap.user_id = auth.uid()
    ));

CREATE POLICY "Users can create notes for their audience profiles" ON audience_notes 
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = audience_profile_id
        AND ap.user_id = auth.uid()
    ));

CREATE POLICY "Users can update notes for their audience profiles" ON audience_notes 
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = audience_notes.audience_profile_id
        AND ap.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete notes for their audience profiles" ON audience_notes 
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM audience_profiles ap
        WHERE ap.id = audience_notes.audience_profile_id
        AND ap.user_id = auth.uid()
    ));

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON market_data TO authenticated;
GRANT ALL ON brand_data TO authenticated;
GRANT ALL ON competitors TO authenticated;
GRANT ALL ON audience_profiles TO authenticated;
GRANT ALL ON voice_of_customer TO authenticated;
GRANT ALL ON audience_notes TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
