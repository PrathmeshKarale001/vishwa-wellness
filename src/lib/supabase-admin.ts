import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client that bypasses Row Level Security (RLS).
 * USE WITH CAUTION - Only for server-side operations that require elevated privileges.
 * This client should NEVER be exposed to the client-side.
 * 
 * If SUPABASE_SERVICE_ROLE_KEY is not configured, falls back to anon key
 * (which means RLS will be enforced - guest checkout may fail).
 */
export function createAdminSupabaseClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
    }

    // Prefer service role key, fall back to anon key with warning
    const keyToUse = supabaseServiceKey || supabaseAnonKey;

    if (!supabaseServiceKey && supabaseAnonKey) {
        console.warn('[supabase-admin] SUPABASE_SERVICE_ROLE_KEY not configured. Using anon key - guest checkout may fail due to RLS.');
    }

    if (!keyToUse) {
        throw new Error('Missing Supabase key. Check SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    return createClient(supabaseUrl, keyToUse, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
