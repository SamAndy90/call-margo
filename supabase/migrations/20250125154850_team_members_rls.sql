-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view team members of their company"
    ON team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert team members to their company"
    ON team_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update team members in their company"
    ON team_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete team members from their company"
    ON team_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = team_members.company_id
            AND companies.user_id = auth.uid()
        )
    );
