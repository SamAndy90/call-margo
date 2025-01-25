-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    key_features JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    pricing_model TEXT NOT NULL DEFAULT '',
    price_points JSONB DEFAULT '[]'::jsonb,
    target_audience TEXT NOT NULL DEFAULT '',
    competitive_advantage TEXT NOT NULL DEFAULT '',
    development_stage TEXT NOT NULL DEFAULT '',
    launch_date DATE,
    documentation_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
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

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
