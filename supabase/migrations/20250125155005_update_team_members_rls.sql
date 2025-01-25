-- Drop existing policies
DROP POLICY IF EXISTS "Users can view team members of their company" ON team_members;
DROP POLICY IF EXISTS "Users can insert team members to their company" ON team_members;
DROP POLICY IF EXISTS "Users can update team members in their company" ON team_members;
DROP POLICY IF EXISTS "Users can delete team members from their company" ON team_members;

-- Create more permissive policies
CREATE POLICY "Enable read access for authenticated users"
    ON team_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON team_members FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
    ON team_members FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
    ON team_members FOR DELETE
    TO authenticated
    USING (true);
