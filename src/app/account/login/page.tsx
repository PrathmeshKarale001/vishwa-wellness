'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/lib/authStore';
import { loginFormSchema, type LoginFormData } from '@/lib/validations/contact';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signIn, signInWithGoogle, user, isLoading, isInitialized } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    // React Hook Form setup with Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    // Check for callback errors
    useEffect(() => {
        const callbackError = searchParams.get('error');
        if (callbackError === 'callback_failed') {
            setServerError('Authentication failed. Please try again.');
        }
    }, [searchParams]);

    // Redirect if already logged in
    useEffect(() => {
        if (isInitialized && user && !isLoading) {
            const next = searchParams.get('next') || '/account';
            router.push(next);
        }
    }, [user, isLoading, isInitialized, router, searchParams]);

    const onSubmit = async (data: LoginFormData) => {
        setServerError('');
        setIsSubmitting(true);

        const { error } = await signIn(data.email, data.password);

        if (error) {
            setServerError(error.message || 'Invalid email or password');
            setIsSubmitting(false);
            return;
        }

        // Redirect to the intended destination or account page
        const nextUrl = searchParams.get('next') || '/account';
        router.push(nextUrl);
    };

    const handleGoogleLogin = async () => {
        setServerError('');
        // Get the intended redirect destination from URL params
        const nextUrl = searchParams.get('next') || '/account';
        console.log('[LOGIN] Starting Google OAuth, redirectTo:', nextUrl);
        const { error } = await signInWithGoogle(nextUrl);
        if (error) {
            console.log('[LOGIN] Google OAuth error:', error);
            setServerError(error.message || 'Google sign-in failed');
        }
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Login</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Login
                    </h1>
                    <p className="text-[#777] mt-2">Welcome back to Vishwa Wellness</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-md mx-auto px-4">
                    <div className="bg-white border border-[#eee] p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {serverError && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {serverError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`w-full pl-10 pr-4 py-3 border focus:outline-none focus:border-[var(--color-primary)] ${errors.email ? 'border-red-400' : 'border-[#ddd]'
                                            }`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className={`w-full pl-10 pr-12 py-3 border focus:outline-none focus:border-[var(--color-primary)] ${errors.password ? 'border-red-400' : 'border-[#ddd]'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666]"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register('rememberMe')}
                                        className="rounded border-[#ddd]"
                                    />
                                    <span className="text-[#777]">Remember me</span>
                                </label>
                                <Link href="/account/forgot-password" className="text-[var(--color-primary)] hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-solid py-4 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-[#eee] text-center">
                            <p className="text-[#777] text-sm">
                                Don&apos;t have an account?{' '}
                                <Link href="/account/register" className="text-[var(--color-primary)] font-medium hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>

                        {/* Social Login */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#eee]"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-[#999]">Or continue with</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full py-3 px-4 border border-[#ddd] text-[#777] hover:bg-[#f5f5f5] transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
