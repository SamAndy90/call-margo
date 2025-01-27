-- Drop existing triggers first
drop trigger if exists set_updated_at on public.profiles;
drop function if exists public.handle_updated_at();

-- Drop existing policies
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

-- Drop the table if it exists
drop table if exists public.profiles;

-- Create profiles table
create table public.profiles (
    id uuid not null primary key,
    full_name text,
    company text,
    role text,
    updated_at timestamptz,
    created_at timestamptz default now() not null,
    constraint fk_user
        foreign key (id)
        references auth.users (id)
        on delete cascade
);

-- Grant access to public
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on public.profiles to postgres, anon, authenticated, service_role;

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can insert own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Create updated_at trigger
create function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();
