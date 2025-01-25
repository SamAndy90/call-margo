-- Add unique constraint for company_id and email combination
ALTER TABLE team_members
ADD CONSTRAINT team_members_company_id_email_key UNIQUE (company_id, email);
