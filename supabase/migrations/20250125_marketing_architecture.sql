-- Drop existing tables if they exist
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS audience_profiles CASCADE;
DROP TABLE IF EXISTS voice_of_customer CASCADE;
DROP TABLE IF EXISTS audience_notes CASCADE;

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    mission TEXT NOT NULL DEFAULT '',
    vision TEXT NOT NULL DEFAULT '',
    website TEXT NOT NULL DEFAULT '',
    founded DATE,
    strengths TEXT NOT NULL DEFAULT '',
    weaknesses TEXT NOT NULL DEFAULT '',
    differentiators TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create team_members table
CREATE TABLE team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT,
    role_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Create brands table
CREATE TABLE brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    brand_name TEXT,
    tagline TEXT,
    values TEXT,
    voice_tone TEXT,
    visual_identity TEXT,
    color_palette TEXT,
    typography TEXT,
    logo_usage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create audience_profiles table
CREATE TABLE IF NOT EXISTS audience_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    problems JSONB DEFAULT '[]'::jsonb,
    product_solutions JSONB DEFAULT '[]'::jsonb,
    attraction_channels JSONB DEFAULT '[]'::jsonb,
    engagement_channels JSONB DEFAULT '[]'::jsonb,
    valuable_segments TEXT NOT NULL DEFAULT '',
    common_objections JSONB DEFAULT '[]'::jsonb,
    common_channels JSONB DEFAULT '[]'::jsonb,
    trusted_platforms JSONB DEFAULT '[]'::jsonb,
    complementary_problems JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create voice_of_customer table for VOC data
CREATE TABLE IF NOT EXISTS voice_of_customer (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audience_profile_id UUID REFERENCES audience_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    customer_name TEXT NOT NULL DEFAULT '',
    customer_title TEXT NOT NULL DEFAULT '',
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create audience_notes table for custom notes
CREATE TABLE IF NOT EXISTS audience_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audience_profile_id UUID REFERENCES audience_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audience_profiles_updated_at ON audience_profiles;
CREATE TRIGGER update_audience_profiles_updated_at
    BEFORE UPDATE ON audience_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_voice_of_customer_updated_at ON voice_of_customer;
CREATE TRIGGER update_voice_of_customer_updated_at
    BEFORE UPDATE ON voice_of_customer
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audience_notes_updated_at ON audience_notes;
CREATE TRIGGER update_audience_notes_updated_at
    BEFORE UPDATE ON audience_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_of_customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for companies
DROP POLICY IF EXISTS "Users can view their own company data" ON companies;
CREATE POLICY "Users can view their own company data"
    ON companies FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own company data" ON companies;
CREATE POLICY "Users can insert their own company data"
    ON companies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own company data" ON companies;
CREATE POLICY "Users can update their own company data"
    ON companies FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own company data" ON companies;
CREATE POLICY "Users can delete their own company data"
    ON companies FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for team_members
DROP POLICY IF EXISTS "Users can view their company's team members" ON team_members;
CREATE POLICY "Users can view their company's team members"
    ON team_members FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = team_members.company_id
        AND companies.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert team members for their company" ON team_members;
CREATE POLICY "Users can insert team members for their company"
    ON team_members FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = team_members.company_id
        AND companies.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update their company's team members" ON team_members;
CREATE POLICY "Users can update their company's team members"
    ON team_members FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = team_members.company_id
        AND companies.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = team_members.company_id
        AND companies.user_id = auth.uid()
    ));

-- Create RLS policies for brands
DROP POLICY IF EXISTS "Users can view their own brand data" ON brands;
CREATE POLICY "Users can view their own brand data"
    ON brands FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own brand data" ON brands;
CREATE POLICY "Users can insert their own brand data"
    ON brands FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own brand data" ON brands;
CREATE POLICY "Users can update their own brand data"
    ON brands FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for audience_profiles
DROP POLICY IF EXISTS "Users can view their own audience profiles" ON audience_profiles;
CREATE POLICY "Users can view their own audience profiles"
    ON audience_profiles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own audience profiles" ON audience_profiles;
CREATE POLICY "Users can insert their own audience profiles"
    ON audience_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own audience profiles" ON audience_profiles;
CREATE POLICY "Users can update their own audience profiles"
    ON audience_profiles FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own audience profiles" ON audience_profiles;
CREATE POLICY "Users can delete their own audience profiles"
    ON audience_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for voice_of_customer
DROP POLICY IF EXISTS "Users can view VOC for their audience profiles" ON voice_of_customer;
CREATE POLICY "Users can view VOC for their audience profiles"
    ON voice_of_customer FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = voice_of_customer.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert VOC for their audience profiles" ON voice_of_customer;
CREATE POLICY "Users can insert VOC for their audience profiles"
    ON voice_of_customer FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = voice_of_customer.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update VOC for their audience profiles" ON voice_of_customer;
CREATE POLICY "Users can update VOC for their audience profiles"
    ON voice_of_customer FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = voice_of_customer.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete VOC for their audience profiles" ON voice_of_customer;
CREATE POLICY "Users can delete VOC for their audience profiles"
    ON voice_of_customer FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = voice_of_customer.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));

-- Create RLS policies for audience_notes
DROP POLICY IF EXISTS "Users can view notes for their audience profiles" ON audience_notes;
CREATE POLICY "Users can view notes for their audience profiles"
    ON audience_notes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = audience_notes.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert notes for their audience profiles" ON audience_notes;
CREATE POLICY "Users can insert notes for their audience profiles"
    ON audience_notes FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = audience_notes.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update notes for their audience profiles" ON audience_notes;
CREATE POLICY "Users can update notes for their audience profiles"
    ON audience_notes FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = audience_notes.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete notes for their audience profiles" ON audience_notes;
CREATE POLICY "Users can delete notes for their audience profiles"
    ON audience_notes FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM audience_profiles
        WHERE audience_profiles.id = audience_notes.audience_profile_id
        AND audience_profiles.user_id = auth.uid()
    ));
