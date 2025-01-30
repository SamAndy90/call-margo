BEGIN;

-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS project_priority CASCADE;

-- Create enums
CREATE TYPE project_status AS ENUM ('todo', 'in_progress', 'in_review', 'done', 'backlog', 'archived');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high');

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'todo',
    due_date TIMESTAMP WITH TIME ZONE,
    priority project_priority NOT NULL DEFAULT 'medium',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own projects
CREATE POLICY "Users can view their own projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own projects
CREATE POLICY "Users can create their own projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own projects
CREATE POLICY "Users can update their own projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own projects
CREATE POLICY "Users can delete their own projects"
    ON public.projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
