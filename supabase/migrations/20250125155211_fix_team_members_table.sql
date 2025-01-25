-- Disable RLS temporarily
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- Add NOT NULL constraints where needed and set proper defaults
ALTER TABLE team_members 
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN role SET NOT NULL DEFAULT 'member',
    ALTER COLUMN name SET DEFAULT '',
    ALTER COLUMN role_description SET DEFAULT '';

-- Add unique constraint for company_id + email combination
ALTER TABLE team_members 
    ADD CONSTRAINT team_members_company_id_email_key UNIQUE (company_id, email);

-- Re-enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view team members for their company" ON team_members;
DROP POLICY IF EXISTS "Users can insert team members for their company" ON team_members;
DROP POLICY IF EXISTS "Users can update team members for their company" ON team_members;
DROP POLICY IF EXISTS "Users can delete team members for their company" ON team_members;

-- Create new simplified policies
CREATE POLICY "Enable read for users with company access"
    ON team_members FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM companies 
        WHERE companies.id = team_members.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Enable insert for users with company access"
    ON team_members FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM companies 
        WHERE companies.id = team_members.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Enable update for users with company access"
    ON team_members FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM companies 
        WHERE companies.id = team_members.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Enable delete for users with company access"
    ON team_members FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM companies 
        WHERE companies.id = team_members.company_id 
        AND companies.user_id = auth.uid()
    ));

-- Grant necessary permissions
GRANT ALL ON team_members TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
