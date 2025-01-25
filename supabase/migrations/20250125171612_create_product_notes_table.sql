-- Drop existing product_notes table if it exists
DROP TABLE IF EXISTS product_notes CASCADE;

-- Create product_notes table
CREATE TABLE product_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS product_notes_product_id_idx ON product_notes(product_id);
CREATE INDEX IF NOT EXISTS product_notes_created_by_idx ON product_notes(created_by);

-- Enable RLS
ALTER TABLE product_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view product notes for products they own"
    ON product_notes
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM products
        JOIN companies ON companies.id = products.company_id
        WHERE products.id = product_notes.product_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own product notes"
    ON product_notes
    FOR INSERT
    WITH CHECK (
        auth.uid() = created_by
        AND EXISTS (
            SELECT 1 FROM products
            JOIN companies ON companies.id = products.company_id
            WHERE products.id = product_notes.product_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own product notes"
    ON product_notes
    FOR UPDATE
    USING (
        auth.uid() = created_by
        AND EXISTS (
            SELECT 1 FROM products
            JOIN companies ON companies.id = products.company_id
            WHERE products.id = product_notes.product_id
            AND companies.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = created_by
        AND EXISTS (
            SELECT 1 FROM products
            JOIN companies ON companies.id = products.company_id
            WHERE products.id = product_notes.product_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own product notes"
    ON product_notes
    FOR DELETE
    USING (
        auth.uid() = created_by
        AND EXISTS (
            SELECT 1 FROM products
            JOIN companies ON companies.id = products.company_id
            WHERE products.id = product_notes.product_id
            AND companies.user_id = auth.uid()
        )
    );

-- Create trigger for updating updated_at
CREATE TRIGGER update_product_notes_updated_at
    BEFORE UPDATE ON product_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
