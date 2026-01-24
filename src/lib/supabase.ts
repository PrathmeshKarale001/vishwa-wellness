import { createBrowserClient } from '@supabase/ssr';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Auth features will be disabled.');
}

// Browser client for client components
export function createClient() {
    return createBrowserClient(
        supabaseUrl || '',
        supabaseAnonKey || ''
    );
}

// Singleton instance for convenience
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
