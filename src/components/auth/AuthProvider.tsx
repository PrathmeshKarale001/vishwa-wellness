'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/authStore';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const initialize = useAuthStore((state) => state.initialize);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [initialize, isInitialized]);

    return <>{children}</>;
}
