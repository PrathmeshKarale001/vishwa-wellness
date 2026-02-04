import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');

    // Check for redirect destination: first URL param, then cookie, then default
    let next = searchParams.get('next');
    if (!next) {
        const authRedirectCookie = request.cookies.get('auth_redirect')?.value;
        next = authRedirectCookie ? decodeURIComponent(authRedirectCookie) : '/account';
    }

    if (!next.startsWith('/')) {
        next = '/account';
    }

    if (!code) {
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

    if (error) {
        return NextResponse.redirect(`${origin}/account/login?error=callback_failed`);
    }

    // Wait for setAll to be called with a timeout
    const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 1000));
    await Promise.race([cookiesSetPromise, timeoutPromise]);

    // Create response with cookies
    const response = NextResponse.redirect(redirectUrl);

    cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as any);
    });

    // Clear the auth_redirect cookie after use
    response.cookies.set('auth_redirect', '', { path: '/', maxAge: 0 });

    return response;
}
