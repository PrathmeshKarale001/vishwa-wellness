import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // If "next" is in param, use it as the redirect URL
    let next = searchParams.get('next') ?? '/account';

    // Ensure next is a relative URL for security
    if (!next.startsWith('/')) {
        next = '/account';
    }

    // If no code provided, redirect to login without error
    if (!code) {
        return NextResponse.redirect(`${origin}/account/login`);
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // Ignore errors in Server Component context
                    }
                },
            },
        }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
        // Handle forwarded host for production load balancers
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';

        if (isLocalEnv) {
            // In development, use origin directly
            return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
            // In production with load balancer
            return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Code exchange failed
    return NextResponse.redirect(`${origin}/account/login?error=callback_failed`);
}
