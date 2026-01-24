'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Mail, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuthStore();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const { error } = await resetPassword(email);

        if (error) {
            setError(error.message || 'Failed to send reset email');
            setIsSubmitting(false);
            return;
        }

        setSuccess(true);
        setIsSubmitting(false);
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
                            <span className="text-[#222]">Reset Password</span>
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
                                We&apos;ve sent a password reset link to <strong>{email}</strong>.
                                Please click the link to reset your password.
                            </p>
                            <Link href="/account/login" className="btn-solid inline-block">
                                Back to Login
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
                        <span className="text-[#222]">Forgot Password</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Forgot Password
                    </h1>
                    <p className="text-[#777] mt-2">Enter your email to receive a reset link</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-md mx-auto px-4">
                    <div className="bg-white border border-[#eee] p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {error}
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-solid py-4 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <div className="text-center">
                                <Link href="/account/login" className="text-sm text-[var(--color-primary)] hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
