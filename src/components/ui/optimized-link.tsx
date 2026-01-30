'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface OptimizedLinkProps extends Omit<LinkProps, 'href'> {
    href: string;
    children: ReactNode;
    className?: string;
    prefetchOnHover?: boolean;
    prefetchOnVisible?: boolean;
    prefetchPriority?: 'high' | 'low';
}

/**
 * Optimized Link component with intelligent prefetching strategies
 * - Desktop: Prefetch on hover
 * - Mobile: Prefetch when link becomes visible in viewport
 * - Respects user's data saver preferences
 */
export default function OptimizedLink({
    href,
    children,
    className,
    prefetchOnHover = true,
    prefetchOnVisible = true,
    prefetchPriority = 'low',
    ...props
}: OptimizedLinkProps) {
    const router = useRouter();
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [prefetched, setPrefetched] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Check if data saver mode is enabled
    const isDataSaverEnabled = (): boolean => {
        if (typeof navigator !== 'undefined' && 'connection' in navigator) {
            const connection = (navigator as any).connection;
            return connection?.saveData === true;
        }
        return false;
    };

    // Prefetch the route
    const prefetch = () => {
        if (prefetched || isDataSaverEnabled()) {
            return;
        }

        try {
            router.prefetch(href);
            setPrefetched(true);
        } catch (error) {
            console.error('[Prefetch] Error:', error);
        }
    };

    // Handle hover prefetch (desktop)
    const handleMouseEnter = () => {
        if (prefetchOnHover && !prefetched) {
            prefetch();
        }
    };

    // Handle visibility-based prefetch (mobile)
    useEffect(() => {
        if (!prefetchOnVisible || !linkRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);

                        // Delay prefetch slightly to prioritize visible content
                        const delay = prefetchPriority === 'high' ? 0 : 100;
                        setTimeout(() => {
                            if (!prefetched) {
                                prefetch();
                            }
                        }, delay);
                    }
                });
            },
            {
                rootMargin: '50px', // Start prefetching 50px before link enters viewport
                threshold: 0.1,
            }
        );

        observer.observe(linkRef.current);

        return () => {
            observer.disconnect();
        };
    }, [prefetchOnVisible, prefetched, prefetchPriority]);

    return (
        <Link
            ref={linkRef}
            href={href}
            className={className}
            onMouseEnter={handleMouseEnter}
            prefetch={false} // We handle prefetching manually
            {...props}
        >
            {children}
        </Link>
    );
}
