'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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
    const { user, isLoading, isInitialized } = useAuthStore();

    useEffect(() => {
        if (isInitialized && !isLoading && !user) {
            router.push(redirectTo);
        }
    }, [user, isLoading, isInitialized, router, redirectTo]);

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
    if (!user) {
        return fallback || (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#777]">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Authenticated - render children
    return <>{children}</>;
}
