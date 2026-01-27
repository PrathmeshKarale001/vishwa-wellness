import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    let next = searchParams.get('next') ?? '/account';

    console.log('[AUTH CALLBACK] Received request with code:', code ? 'present' : 'missing');

    if (!next.startsWith('/')) {
        next = '/account';
    }

    if (!code) {
        console.log('[AUTH CALLBACK] No code, redirecting to login');
        return NextResponse.redirect(`${origin}/account/login`);
    }

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    let redirectUrl: string;
    if (isLocalEnv) {
        redirectUrl = `${origin}${next}`;
    } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
    } else {
        redirectUrl = `${origin}${next}`;
    }

    // Use a promise to wait for cookies to be set
    let resolveSetAll: () => void;
    const cookiesSetPromise = new Promise<void>((resolve) => {
        resolveSetAll = resolve;
    });

    // Collect cookies
    const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = [];
    let setAllCalled = false;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookies) {
                    console.log('[AUTH CALLBACK] setAll called with', cookies.length, 'cookies');
                    cookies.forEach((cookie) => {
                        cookiesToSet.push(cookie);
                    });
                    setAllCalled = true;
                    resolveSetAll();
                },
            },
        }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    console.log('[AUTH CALLBACK] Exchange result:', error ? `error: ${error.message}` : `success, user: ${data?.user?.email}`);

    if (error) {
        console.log('[AUTH CALLBACK] Exchange failed');
        return NextResponse.redirect(`${origin}/account/login?error=callback_failed`);
    }

    // Wait for setAll to be called with a timeout
    const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 1000));

    console.log('[AUTH CALLBACK] Waiting for cookies...');
    await Promise.race([cookiesSetPromise, timeoutPromise]);

    console.log('[AUTH CALLBACK] setAllCalled:', setAllCalled, 'cookies:', cookiesToSet.length);

    // Create response with cookies
    const response = NextResponse.redirect(redirectUrl);

    cookiesToSet.forEach(({ name, value, options }) => {
        console.log('[AUTH CALLBACK] Setting cookie:', name);
        response.cookies.set(name, value, options as any);
    });

    console.log('[AUTH CALLBACK] Redirecting to:', redirectUrl);
    return response;
}
