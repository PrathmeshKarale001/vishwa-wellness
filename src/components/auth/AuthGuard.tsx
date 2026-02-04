'use client';

import { useEffect, ReactNode, useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
    redirectTo?: string;
}

export function AuthGuard({
    children,
    fallback,
    redirectTo = '/account/login'
}: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, isLoading, isInitialized, initialize } = useAuthStore();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [isWaiting, setIsWaiting] = useState(true);
    const hasChecked = useRef(false);

    // Detect if we just came from OAuth callback
    const isPostOAuth = typeof window !== 'undefined' && (
        document.referrer.includes('/auth/callback') ||
        sessionStorage.getItem('oauth_in_progress') === 'true'
    );

    useEffect(() => {
        // Clear OAuth flag after a delay
        if (isPostOAuth) {
            const timer = setTimeout(() => {
                sessionStorage.removeItem('oauth_in_progress');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isPostOAuth]);

    useEffect(() => {
        // Don't check until initialized
        if (!isInitialized || isLoading) {
            return;
        }

        // If we have a user, we're good
        if (user) {
            setIsWaiting(false);
            hasChecked.current = true;
            return;
        }

        // If no user and we haven't checked yet, wait longer after OAuth
        if (!hasChecked.current) {
            const delay = isPostOAuth ? 2000 : 500; // Longer wait after OAuth

            const timer = setTimeout(async () => {
                // Re-initialize auth to pick up any new session
                await initialize();

                const currentUser = useAuthStore.getState().user;

                if (!currentUser) {
                    setShouldRedirect(true);
                }
                setIsWaiting(false);
                hasChecked.current = true;
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [user, isLoading, isInitialized, isPostOAuth, initialize]);

    useEffect(() => {
        if (shouldRedirect) {
            const loginUrl = new URL(redirectTo, window.location.origin);
            loginUrl.searchParams.set('next', pathname);
            router.push(loginUrl.toString());
        }
    }, [shouldRedirect, router, redirectTo, pathname]);

    // Show loading state while checking auth
    if (!isInitialized || isLoading || isWaiting) {
        return fallback || (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#777]">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - will redirect
    if (!user || shouldRedirect) {
        return fallback || (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#777]">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Authenticated - render children
    return <>{children}</>;
}
