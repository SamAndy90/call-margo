-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view products for their company" ON products;
DROP POLICY IF EXISTS "Users can insert products for their company" ON products;
DROP POLICY IF EXISTS "Users can update their company's products" ON products;
DROP POLICY IF EXISTS "Users can delete their company's products" ON products;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Re-create RLS policies with corrected syntax
CREATE POLICY "Users can view products for their company"
    ON products FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = products.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert products for their company"
    ON products FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = products.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their company's products"
    ON products FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = products.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their company's products"
    ON products FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = products.company_id
        AND companies.user_id = auth.uid()
    ));

-- Re-create trigger for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON products TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
