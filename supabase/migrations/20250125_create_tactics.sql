-- Create tactics table
CREATE TABLE IF NOT EXISTS public.tactics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    stage TEXT NOT NULL,
    audience_types TEXT[] DEFAULT array[]::TEXT[],
    product_types TEXT[] DEFAULT array[]::TEXT[],
    channels TEXT[] DEFAULT array[]::TEXT[],
    budget_range TEXT,
    keywords TEXT[] DEFAULT array[]::TEXT[],
    example TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.tactics ENABLE ROW LEVEL SECURITY;

-- Policy to allow all users to view tactics
CREATE POLICY "Allow all users to view tactics"
    ON public.tactics
    FOR SELECT
    TO authenticated
    USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tactics_updated_at
    BEFORE UPDATE ON public.tactics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial tactics for each stage
INSERT INTO public.tactics (name, description, stage, audience_types, product_types, channels, budget_range, keywords, example) VALUES
-- Foundations Stage
('Brand Identity Development', 'Create a cohesive brand identity including logo, colors, and messaging', 'Foundations', 
 ARRAY['b2b', 'b2c', 'enterprise'], ARRAY['saas', 'physical', 'service'], 
 ARRAY['website', 'social'], 'medium',
 ARRAY['branding', 'design', 'identity'], 'Develop a brand style guide and visual identity system'),

('Website Optimization', 'Optimize website for conversion and user experience', 'Foundations',
 ARRAY['b2b', 'b2c', 'enterprise'], ARRAY['saas', 'physical', 'service'],
 ARRAY['website'], 'medium',
 ARRAY['website', 'conversion', 'ux'], 'Implement A/B testing on landing pages'),

-- Reach Stage
('Content Marketing Strategy', 'Create and distribute valuable content to attract target audience', 'Reach',
 ARRAY['b2b', 'b2c'], ARRAY['saas', 'service'],
 ARRAY['content', 'social', 'email'], 'low',
 ARRAY['content', 'blog', 'seo'], 'Launch an industry-focused blog with weekly posts'),

('Paid Social Campaign', 'Run targeted social media advertising campaigns', 'Reach',
 ARRAY['b2c'], ARRAY['physical', 'service'],
 ARRAY['social', 'ads'], 'high',
 ARRAY['social', 'advertising', 'ppc'], 'Launch Instagram carousel ads for product showcase'),

-- Engage Stage
('Email Nurture Sequence', 'Develop automated email sequences to nurture leads', 'Engage',
 ARRAY['b2b', 'enterprise'], ARRAY['saas', 'service'],
 ARRAY['email'], 'low',
 ARRAY['email', 'automation', 'nurture'], 'Create a 5-email welcome sequence for new subscribers'),

('Community Building', 'Build and engage with a community around your brand', 'Engage',
 ARRAY['b2c'], ARRAY['saas', 'physical'],
 ARRAY['social', 'content'], 'medium',
 ARRAY['community', 'social', 'engagement'], 'Launch a Facebook group for product users'),

-- Convert Stage
('Sales Enablement', 'Create materials and processes to support sales team', 'Convert',
 ARRAY['b2b', 'enterprise'], ARRAY['saas', 'service'],
 ARRAY['content', 'email'], 'medium',
 ARRAY['sales', 'enablement', 'content'], 'Develop case studies and product comparison guides'),

('Limited Time Offer', 'Create urgency with time-sensitive promotions', 'Convert',
 ARRAY['b2c'], ARRAY['physical', 'service'],
 ARRAY['email', 'ads'], 'medium',
 ARRAY['promotion', 'offer', 'urgency'], 'Run a 48-hour flash sale with exclusive discounts'),

-- Delight Stage
('Customer Success Program', 'Implement program to ensure customer success and satisfaction', 'Delight',
 ARRAY['b2b', 'enterprise'], ARRAY['saas'],
 ARRAY['email', 'content'], 'medium',
 ARRAY['customer success', 'retention', 'satisfaction'], 'Launch a customer onboarding program'),

('Loyalty Program', 'Reward loyal customers and encourage repeat business', 'Delight',
 ARRAY['b2c'], ARRAY['physical', 'service'],
 ARRAY['email', 'website'], 'high',
 ARRAY['loyalty', 'rewards', 'retention'], 'Create a points-based rewards program');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS tactics_stage_idx ON public.tactics(stage);
CREATE INDEX IF NOT EXISTS tactics_name_idx ON public.tactics(name);
