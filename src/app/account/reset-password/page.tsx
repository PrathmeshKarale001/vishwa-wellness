'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Check if we have a valid session from the reset link
    useEffect(() => {
        const supabase = getSupabaseClient();

        // Listen for password recovery event
        supabase.auth.onAuthStateChange((event: string) => {
            if (event === 'PASSWORD_RECOVERY') {
                // User clicked the reset link and is ready to set new password
                console.log('Password recovery mode active');
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsSubmitting(true);

        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message || 'Failed to update password');
            setIsSubmitting(false);
            return;
        }

        setSuccess(true);
        setIsSubmitting(false);

        // Redirect to login after 3 seconds
        setTimeout(() => {
            router.push('/account/login');
        }, 3000);
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
                                Password Updated
                            </h2>
                            <p className="text-[#777] mb-6">
                                Your password has been successfully reset.
                                Redirecting to login...
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
                        <span className="text-[#222]">Reset Password</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Set New Password
                    </h1>
                    <p className="text-[#777] mt-2">Enter your new password below</p>
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
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-solid py-4 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
