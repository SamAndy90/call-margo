-- Function to ensure company exists for user
CREATE OR REPLACE FUNCTION ensure_company_exists()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user already has a company
    IF NOT EXISTS (
        SELECT 1 FROM companies WHERE user_id = NEW.id
    ) THEN
        -- Create default company for new user
        INSERT INTO companies (
            user_id,
            name,
            description,
            mission,
            vision,
            website,
            founded,
            strengths,
            weaknesses,
            differentiators
        ) VALUES (
            NEW.id,
            '',
            '',
            '',
            '',
            '',
            NULL,
            '',
            '',
            ''
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_company_exists();

-- Ensure companies exist for all current users
DO $$
BEGIN
    INSERT INTO companies (
        user_id,
        name,
        description,
        mission,
        vision,
        website,
        founded,
        strengths,
        weaknesses,
        differentiators
    )
    SELECT 
        users.id,
        '',
        '',
        '',
        '',
        '',
        NULL,
        '',
        '',
        ''
    FROM auth.users users
    WHERE NOT EXISTS (
        SELECT 1 FROM companies WHERE companies.user_id = users.id
    );
END $$;
