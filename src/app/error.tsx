'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service
        console.error('Page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-[family-name:var(--font-playfair)] text-[var(--color-navy)] mb-4">
                    Something Went Wrong
                </h1>
                <p className="text-[var(--color-navy)]/70 mb-8">
                    We encountered an unexpected error. Please try again or return to the homepage.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="btn-solid !px-8 !py-3"
                        aria-label="Try again"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="btn-outline !px-8 !py-3"
                        aria-label="Return to homepage"
                    >
                        Go Home
                    </Link>
                </div>

                {/* Error Details (development only) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <details className="mt-12 text-left">
                        <summary className="cursor-pointer text-sm text-[var(--color-navy)]/50 hover:text-[var(--color-navy)]">
                            Error Details (Dev Only)
                        </summary>
                        <pre className="mt-4 p-4 bg-white rounded-lg text-xs overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}
