-- First, let's verify and fix the table structure
DO $$ 
BEGIN
    -- Drop all existing RLS policies
    DROP POLICY IF EXISTS "Users can view products for their company" ON products;
    DROP POLICY IF EXISTS "Users can insert products for their company" ON products;
    DROP POLICY IF EXISTS "Users can update their company's products" ON products;
    DROP POLICY IF EXISTS "Users can delete their company's products" ON products;
    
    -- Disable RLS temporarily to fix any data issues
    ALTER TABLE products DISABLE ROW LEVEL SECURITY;
    
    -- Re-enable RLS with proper policies
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    
    -- Create simplified RLS policies
    CREATE POLICY "Enable read access for authenticated users"
        ON products FOR SELECT
        TO authenticated
        USING (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = products.company_id
            )
        );

    CREATE POLICY "Enable insert access for authenticated users"
        ON products FOR INSERT
        TO authenticated
        WITH CHECK (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = products.company_id
            )
        );

    CREATE POLICY "Enable update access for authenticated users"
        ON products FOR UPDATE
        TO authenticated
        USING (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = products.company_id
            )
        );

    CREATE POLICY "Enable delete access for authenticated users"
        ON products FOR DELETE
        TO authenticated
        USING (
            auth.uid() IN (
                SELECT user_id 
                FROM companies 
                WHERE id = products.company_id
            )
        );

END $$;

-- Ensure proper grants are in place
GRANT ALL ON products TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify the trigger is properly set up
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
