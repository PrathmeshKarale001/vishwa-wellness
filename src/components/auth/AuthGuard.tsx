'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
    const { user, isLoading, isInitialized } = useAuthStore();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        // Wait a bit after initialization to allow session to sync
        // This prevents premature redirects right after OAuth callback
        if (isInitialized && !isLoading && !user) {
            const timer = setTimeout(() => {
                // Double-check after delay
                const currentUser = useAuthStore.getState().user;
                if (!currentUser) {
                    console.log('[AuthGuard] No user found, redirecting to login');
                    setShouldRedirect(true);
                }
            }, 100); // Small delay to allow session sync

            return () => clearTimeout(timer);
        }
    }, [user, isLoading, isInitialized]);

    useEffect(() => {
        if (shouldRedirect) {
            const loginUrl = new URL(redirectTo, window.location.origin);
            loginUrl.searchParams.set('next', pathname);
            router.push(loginUrl.toString());
        }
    }, [shouldRedirect, router, redirectTo, pathname]);

    // Show loading state while checking auth
    if (!isInitialized || isLoading) {
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
