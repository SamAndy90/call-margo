-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON team_members TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure the table is accessible
ALTER TABLE team_members FORCE ROW LEVEL SECURITY;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON team_members;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON team_members;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON team_members;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON team_members;

-- Create simpler RLS policies
CREATE POLICY "Team members are viewable by users in same company"
    ON team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND (companies.user_id = auth.uid()
                 OR team_members.email = auth.email())
        )
    );

CREATE POLICY "Team members can be inserted by company owners"
    ON team_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can be updated by company owners"
    ON team_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can be deleted by company owners"
    ON team_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    );
