import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Skip middleware if Supabase is not configured
    if (!supabaseUrl || !supabaseAnonKey) {
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Do NOT check getUser() on auth callback path
    // The cookies haven't been set yet in that context
    const isAuthCallback = request.nextUrl.pathname.startsWith('/auth/callback');
    if (isAuthCallback) {
        return supabaseResponse;
    }

    // Refresh session if exists
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Protected routes that require authentication (checkout allows guest users)
    const protectedPaths = ['/account', '/admin'];
    const publicAuthPages = ['/account/login', '/account/register', '/account/forgot-password', '/account/reset-password'];

    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    // Exclude public auth pages from protection
    const isPublicAuthPage = publicAuthPages.some((path) =>
        request.nextUrl.pathname === path
    );

    // Redirect to login if accessing protected route without authentication
    if (isProtectedPath && !isPublicAuthPage && !user) {
        const loginUrl = new URL('/account/login', request.url);
        loginUrl.searchParams.set('next', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in users away from login/register pages to their intended destination or account
    if (isPublicAuthPage && user) {
        const next = request.nextUrl.searchParams.get('next');
        const redirectUrl = next && next.startsWith('/') ? next : '/account';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes
         * - studio (Sanity Studio)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|studio).*)',
    ],
};
