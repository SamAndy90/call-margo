
-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    mission text,
    vision text,
    website text,
    founded date,
    strengths text,
    weaknesses text,
    differentiators text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    role_description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS companies_user_id_idx ON companies(user_id);
CREATE INDEX IF NOT EXISTS team_members_company_id_idx ON team_members(company_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up RLS policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company"
    ON companies FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company"
    ON companies FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company"
    ON companies FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their company's team members"
    ON team_members FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = team_members.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert team members for their company"
    ON team_members FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = team_members.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their company's team members"
    ON team_members FOR UPDATE
    TO authenticated
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