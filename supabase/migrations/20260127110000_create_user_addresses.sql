-- Migration: Create user_addresses table for saved addresses
-- Following Supabase Postgres Best Practices

-- Create the user_addresses table
create table if not exists public.user_addresses (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    
    -- Address fields
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text not null,
    address_line1 text not null,
    address_line2 text,
    city text not null,
    state text not null,
    pincode text not null,
    country text not null default 'India',
    
    -- Metadata
    label text, -- e.g., 'Home', 'Office', 'Other'
    is_default boolean default false,
    
    -- Timestamps (always use timestamptz per best practices)
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    
    -- Constraints
    constraint valid_pincode check (pincode ~ '^[1-9][0-9]{5}$'),
    constraint valid_phone check (phone ~ '^[6-9][0-9]{9}$'),
    constraint valid_email check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add comment for documentation
comment on table public.user_addresses is 'Stores saved shipping addresses for users';

-- Create indexes following best practices
-- Index on user_id for faster lookups (foreign key best practice)
create index if not exists idx_user_addresses_user_id on public.user_addresses (user_id);

-- Partial index for default addresses (only index rows where is_default = true)
create index if not exists idx_user_addresses_default 
    on public.user_addresses (user_id, is_default) 
    where is_default = true;

-- Enable Row Level Security (critical for multi-tenant data)
alter table public.user_addresses enable row level security;

-- Force RLS even for table owners
alter table public.user_addresses force row level security;

-- RLS Policy: Users can only see their own addresses
-- Using (select auth.uid()) pattern for performance optimization (called once, not per row)
create policy "Users can view their own addresses"
    on public.user_addresses
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

-- RLS Policy: Users can insert their own addresses
create policy "Users can insert their own addresses"
    on public.user_addresses
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

-- RLS Policy: Users can update their own addresses
create policy "Users can update their own addresses"
    on public.user_addresses
    for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

-- RLS Policy: Users can delete their own addresses
create policy "Users can delete their own addresses"
    on public.user_addresses
    for delete
    to authenticated
    using ((select auth.uid()) = user_id);

-- Function to ensure only one default address per user
create or replace function public.ensure_single_default_address()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    -- If setting this address as default, unset all other defaults for this user
    if new.is_default = true then
        update public.user_addresses
        set is_default = false, updated_at = now()
        where user_id = new.user_id
        and id != new.id
        and is_default = true;
    end if;
    
    return new;
end;
$$;

-- Trigger to maintain single default address
drop trigger if exists trigger_ensure_single_default_address on public.user_addresses;
create trigger trigger_ensure_single_default_address
    before insert or update of is_default on public.user_addresses
    for each row
    when (new.is_default = true)
    execute function public.ensure_single_default_address();

-- Function to automatically update updated_at timestamp
create or replace function public.update_user_addresses_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Trigger to auto-update updated_at
drop trigger if exists trigger_update_user_addresses_updated_at on public.user_addresses;
create trigger trigger_update_user_addresses_updated_at
    before update on public.user_addresses
    for each row
    execute function public.update_user_addresses_updated_at();

-- Grant appropriate permissions (principle of least privilege)
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.user_addresses to authenticated;

-- Revoke from anon (addresses should only be accessible when logged in)
revoke all on public.user_addresses from anon;
