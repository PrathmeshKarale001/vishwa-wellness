'use client';

import { useCallback, useRef, useState } from 'react';

interface RetryOptions {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    retryCondition?: (error: unknown) => boolean;
}

interface RetryState {
    isRetrying: boolean;
    attempt: number;
    lastError: Error | null;
}

/**
 * Hook for retrying async operations with exponential backoff
 * 
 * @example
 * const { execute, isRetrying, cancel } = useRetry();
 * 
 * const result = await execute(
 *   () => fetch('/api/orders', { method: 'POST', body }),
 *   { maxAttempts: 3, baseDelay: 1000 }
 * );
 */
export function useRetry() {
    const [state, setState] = useState<RetryState>({
        isRetrying: false,
        attempt: 0,
        lastError: null,
    });

    const abortRef = useRef<AbortController | null>(null);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const execute = useCallback(async <T>(
        fn: (signal?: AbortSignal) => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> => {
        const {
            maxAttempts = 3,
            baseDelay = 1000,
            maxDelay = 30000,
            backoffFactor = 2,
            retryCondition = () => true,
        } = options;

        abortRef.current = new AbortController();
        const { signal } = abortRef.current;

        setState({ isRetrying: false, attempt: 0, lastError: null });

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                if (signal.aborted) {
                    throw new Error('Operation cancelled');
                }

                setState((prev) => ({ ...prev, attempt, isRetrying: attempt > 1 }));

                const result = await fn(signal);

                setState({ isRetrying: false, attempt: 0, lastError: null });
                return result;

            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));

                setState((prev) => ({ ...prev, lastError: err }));

                // Don't retry if cancelled or on last attempt or condition fails
                if (signal.aborted || attempt >= maxAttempts || !retryCondition(error)) {
                    setState({ isRetrying: false, attempt: 0, lastError: err });
                    throw error;
                }

                // Calculate delay with exponential backoff
                const delay = Math.min(
                    baseDelay * Math.pow(backoffFactor, attempt - 1),
                    maxDelay
                );

                console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
                await sleep(delay);
            }
        }

        throw state.lastError || new Error('Max retries exceeded');
    }, []);

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setState({ isRetrying: false, attempt: 0, lastError: null });
    }, []);

    return {
        execute,
        cancel,
        isRetrying: state.isRetrying,
        attempt: state.attempt,
        lastError: state.lastError,
    };
}

/**
 * Retry utility function for non-hook contexts
 */
export async function retryAsync<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxAttempts = 3,
        baseDelay = 1000,
        maxDelay = 30000,
        backoffFactor = 2,
        retryCondition = () => true,
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            if (attempt >= maxAttempts || !retryCondition(error)) {
                throw error;
            }

            const delay = Math.min(
                baseDelay * Math.pow(backoffFactor, attempt - 1),
                maxDelay
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw lastError || new Error('Max retries exceeded');
}
