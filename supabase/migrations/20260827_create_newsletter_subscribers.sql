-- Migration: Create newsletter_subscribers table
-- Backs the /api/newsletter route, which upserts on the email column.
-- Following Supabase Postgres Best Practices

create table if not exists public.newsletter_subscribers (
    id bigint generated always as identity primary key,

    email text not null,
    subscribed_at timestamptz default now() not null,

    -- Timestamps (always use timestamptz per best practices)
    created_at timestamptz default now() not null,

    -- The API upserts with onConflict: 'email', which requires a unique constraint
    constraint newsletter_subscribers_email_key unique (email)
);

-- Index for lookups by subscription date (newest first)
create index if not exists newsletter_subscribers_subscribed_at_idx
    on public.newsletter_subscribers (subscribed_at desc);

-- Enable Row Level Security
alter table public.newsletter_subscribers enable row level security;

-- No public policies: the API route writes with the service role key, which
-- bypasses RLS. This keeps the subscriber list private from anon/auth clients.
