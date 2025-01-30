BEGIN;

-- Add campaign_id column to projects table with deferred foreign key check
ALTER TABLE projects
ADD COLUMN campaign_id UUID,
ADD CONSTRAINT fk_project_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id)
    ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

-- Add index for better query performance
CREATE INDEX idx_projects_campaign_id ON projects(campaign_id);

-- Update RLS policies to allow access to projects when user has access to the campaign
CREATE POLICY "Users can view projects through campaign access"
ON projects
FOR ALL
USING (
    auth.uid() = user_id OR
    campaign_id IN (
        SELECT id FROM campaigns 
        WHERE user_id = auth.uid()
    )
);

COMMIT;
