-- Create product_notes table
CREATE TABLE IF NOT EXISTS product_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for product_notes
ALTER TABLE product_notes ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own product notes
CREATE POLICY "Users can view product notes for products they own"
    ON product_notes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM products
            JOIN companies ON companies.id = products.company_id
            WHERE products.id = product_notes.product_id
            AND companies.user_id = auth.uid()
        )
    );

-- Allow users to insert their own product notes
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

-- Allow users to update their own product notes
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

-- Allow users to delete their own product notes
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

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_product_notes_updated_at
    BEFORE UPDATE ON product_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
