-- Update products table to match new structure
ALTER TABLE products
    -- Remove old columns that are no longer needed
    DROP COLUMN IF EXISTS key_features,
    DROP COLUMN IF EXISTS benefits,
    DROP COLUMN IF EXISTS pricing_model,
    DROP COLUMN IF EXISTS competitive_advantage,
    DROP COLUMN IF EXISTS development_stage,
    DROP COLUMN IF EXISTS launch_date,
    DROP COLUMN IF EXISTS documentation_url,
    DROP COLUMN IF EXISTS target_audience;

-- Add new columns
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'SaaS',
    ADD COLUMN IF NOT EXISTS custom_type TEXT,
    ADD COLUMN IF NOT EXISTS purpose_benefit TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS market_category TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS problems_solved JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS audience_ids UUID[] DEFAULT '{}'::uuid[];

-- Update price_points to match new structure if it doesn't already
DO $$ 
BEGIN
    -- Only attempt to update if the column exists and has a different structure
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'price_points'
    ) THEN
        -- Convert existing price_points to new structure if needed
        UPDATE products 
        SET price_points = COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'name', 'Default',
                        'price', COALESCE(pp->>'price', ''),
                        'features', COALESCE((pp->>'features')::jsonb, '[]'::jsonb)
                    )
                )
                FROM jsonb_array_elements(price_points) pp
            ),
            '[]'::jsonb
        )
        WHERE jsonb_typeof(price_points) = 'array';
    END IF;
END $$;
