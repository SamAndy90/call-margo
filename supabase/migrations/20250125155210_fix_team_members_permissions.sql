-- First, let's verify and fix the team members table structure
DO $$ 
BEGIN
    -- Drop all existing RLS policies for team_members
    DROP POLICY IF EXISTS "Users can view team members for their company" ON team_members;
    DROP POLICY IF EXISTS "Users can insert team members for their company" ON team_members;
    DROP POLICY IF EXISTS "Users can update team members for their company" ON team_members;
    DROP POLICY IF EXISTS "Users can delete team members for their company" ON team_members;
    
    -- Disable RLS temporarily to fix any data issues
    ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
    
    -- Re-enable RLS with proper policies
    ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
    
    -- Create simplified RLS policies
    CREATE POLICY "Enable read access for team members"
        ON team_members FOR SELECT
        TO authenticated
        USING (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = team_members.company_id
            )
        );

    CREATE POLICY "Enable insert access for team members"
        ON team_members FOR INSERT
        TO authenticated
        WITH CHECK (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = team_members.company_id
            )
        );

    CREATE POLICY "Enable update access for team members"
        ON team_members FOR UPDATE
        TO authenticated
        USING (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = team_members.company_id
            )
        );

    CREATE POLICY "Enable delete access for team members"
        ON team_members FOR DELETE
        TO authenticated
        USING (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = team_members.company_id
            )
        );

END $$;

-- Ensure proper grants are in place
GRANT ALL ON team_members TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify the trigger is properly set up
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
