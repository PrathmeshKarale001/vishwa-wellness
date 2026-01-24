'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

export default function RegisterPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle, user, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user && !isLoading) {
            router.push('/account');
        }
    }, [user, isLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!acceptTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        setIsSubmitting(true);

        const { error } = await signUp(formData.email, formData.password, formData.fullName);

        if (error) {
            setError(error.message || 'Registration failed. Please try again.');
            setIsSubmitting(false);
            return;
        }

        setSuccess(true);
        setIsSubmitting(false);
    };

    const handleGoogleSignUp = async () => {
        setError('');
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message || 'Google sign-up failed');
        }
    };

    if (success) {
        return (
            <>
                {/* Breadcrumb */}
                <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-2 text-sm text-[#777]">
                            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                            <ChevronRight size={14} />
                            <span className="text-[#222]">Create Account</span>
                        </div>
                    </div>
                </div>

                <section className="section-padding">
                    <div className="max-w-md mx-auto px-4 text-center">
                        <div className="bg-white border border-[#eee] p-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-[#222] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                                Check Your Email
                            </h2>
                            <p className="text-[#777] mb-6">
                                We&apos;ve sent a verification link to <strong>{formData.email}</strong>.
                                Please click the link to verify your account.
                            </p>
                            <Link href="/account/login" className="btn-solid inline-block">
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Create Account</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Create Account
                    </h1>
                    <p className="text-[#777] mt-2">Join the Vishwa Wellness community</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-lg mx-auto px-4">
                    <div className="bg-white border border-[#eee] p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Minimum 8 characters"
                                        minLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666]"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1"
                                />
                                <label htmlFor="terms" className="text-sm text-[#777]">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-[var(--color-primary)] hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-solid py-4 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-[#eee] text-center">
                            <p className="text-[#777] text-sm">
                                Already have an account?{' '}
                                <Link href="/account/login" className="text-[var(--color-primary)] font-medium hover:underline">
                                    Sign In
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
                                    <span className="px-4 bg-white text-[#999]">Or sign up with</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={handleGoogleSignUp}
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
