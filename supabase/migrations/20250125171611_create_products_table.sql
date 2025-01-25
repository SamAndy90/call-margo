-- Drop existing products table and related objects
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with updated structure
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'SaaS',
    custom_type TEXT,
    purpose_benefit TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    market_category TEXT NOT NULL DEFAULT '',
    problems_solved JSONB DEFAULT '[]'::jsonb,
    price_points JSONB DEFAULT '[]'::jsonb,
    audience_ids UUID[] DEFAULT '{}'::uuid[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS products_company_id_idx ON products(company_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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
    ))
    WITH CHECK (EXISTS (
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

-- Create trigger for updating updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
