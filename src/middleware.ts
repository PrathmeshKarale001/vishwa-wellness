import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // OAUTH FALLBACK: If we get an OAuth code at root URL, redirect to /auth/callback
    // This handles cases where Supabase redirects to root instead of /auth/callback
    const { pathname, searchParams } = request.nextUrl;
    const code = searchParams.get('code');

    if (pathname === '/' && code) {
        const callbackUrl = new URL('/auth/callback', request.url);
        callbackUrl.searchParams.set('code', code);
        // Preserve any other params
        const next = searchParams.get('next');
        if (next) callbackUrl.searchParams.set('next', next);
        return NextResponse.redirect(callbackUrl);
    }

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

    // Refresh session if exists
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes that require authentication
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

    // For admin routes, verify the user has admin/staff role
    if (request.nextUrl.pathname.startsWith('/admin') && user) {
        // Fetch the user's role from user_roles table
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        const userRole = roleData?.role;
        const isStaffOrAbove = userRole === 'staff' || userRole === 'admin' || userRole === 'super_admin';

        if (!isStaffOrAbove) {
            // Redirect non-admin users to account page
            return NextResponse.redirect(new URL('/account', request.url));
        }
    }

    // Redirect logged-in users away from auth pages (optional)
    const authPaths = ['/auth/login', '/auth/signup'];
    const isAuthPath = authPaths.some((path) =>
        request.nextUrl.pathname === path
    );

    if (isAuthPath && user) {
        return NextResponse.redirect(new URL('/account', request.url));
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
         * - auth (OAuth callbacks)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|studio|auth).*)',
    ],
};
