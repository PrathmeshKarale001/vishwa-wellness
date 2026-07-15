'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/lib/authStore';
import { useAuthModalStore } from '@/lib/authModalStore';
import { loginFormSchema, type LoginFormData } from '@/lib/validations/contact';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function AuthModal() {
    const { isOpen, view, closeModal, setView } = useAuthModalStore();
    const { signIn, signUp, signInWithGoogle } = useAuthStore();
    
    // Login State
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    
    // Register State
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset: resetLoginForm,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const handleClose = () => {
        closeModal();
        setServerError('');
        resetLoginForm();
        setRegisterData({ fullName: '', email: '', password: '', confirmPassword: '' });
        setRegisterSuccess(false);
    };

    const onLoginSubmit = async (data: LoginFormData) => {
        setServerError('');
        setIsSubmitting(true);

        const { error } = await signIn(data.email, data.password);

        if (error) {
            setServerError(error.message || 'Invalid email or password');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        handleClose();
    };

    const onRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (registerData.password !== registerData.confirmPassword) {
            setServerError('Passwords do not match');
            return;
        }

        if (registerData.password.length < 8) {
            setServerError('Password must be at least 8 characters');
            return;
        }

        if (!acceptTerms) {
            setServerError('Please accept the terms and conditions');
            return;
        }

        setIsSubmitting(true);

        const { error } = await signUp(registerData.email, registerData.password, registerData.fullName);

        if (error) {
            setServerError(error.message || 'Registration failed. Please try again.');
            setIsSubmitting(false);
            return;
        }

        setRegisterSuccess(true);
        setIsSubmitting(false);
    };

    const handleGoogleLogin = async () => {
        setServerError('');
        // Ensure redirect back to same page
        const { error } = await signInWithGoogle(window.location.pathname + window.location.search);
        if (error) {
            setServerError(error.message || 'Google sign-in failed');
        }
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
                <div className="p-6 bg-white max-h-[85vh] overflow-y-auto">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                            {view === 'login' ? 'Welcome Back' : 'Create Account'}
                        </DialogTitle>
                        <DialogDescription className="text-[#777] mt-1">
                            {view === 'login' 
                                ? 'Sign in to access your wishlist and orders' 
                                : 'Join the Vishwa Wellness community'}
                        </DialogDescription>
                    </div>

                    {serverError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                            {serverError}
                        </div>
                    )}

                    {view === 'login' ? (
                        /* Login Form */
                        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-[var(--color-primary)] text-sm ${errors.email ? 'border-red-400' : 'border-[#ddd]'}`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:border-[var(--color-primary)] text-sm ${errors.password ? 'border-red-400' : 'border-[#ddd]'}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666]"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-solid py-2.5 text-sm mt-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    ) : registerSuccess ? (
                        /* Register Success */
                        <div className="text-center py-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Check Your Email</h3>
                            <p className="text-sm text-[#777] mb-6">
                                We've sent a verification link to {registerData.email}
                            </p>
                            <button
                                onClick={() => {
                                    setRegisterSuccess(false);
                                    setView('login');
                                }}
                                className="w-full btn-outline py-2.5 text-sm"
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        /* Register Form */
                        <form onSubmit={onRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={registerData.fullName}
                                        onChange={handleRegisterChange}
                                        className="w-full pl-10 pr-4 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[var(--color-primary)] text-sm"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        className="w-full pl-10 pr-4 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[var(--color-primary)] text-sm"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        className="w-full pl-10 pr-10 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[var(--color-primary)] text-sm"
                                        placeholder="Minimum 8 characters"
                                        minLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666]"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        className="w-full pl-10 pr-4 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[var(--color-primary)] text-sm"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="modal-terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1"
                                />
                                <label htmlFor="modal-terms" className="text-xs text-[#777]">
                                    I agree to the Terms of Service and Privacy Policy
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-solid py-2.5 text-sm mt-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    {/* Social Login */}
                    {!registerSuccess && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#eee]"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-white text-[#999]">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full py-2.5 px-4 border border-[#ddd] rounded-md text-[#777] hover:bg-[#f5f5f5] transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                                    Google
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Toggle View */}
                    {!registerSuccess && (
                        <div className="mt-4 pt-4 border-t border-[#eee] text-center">
                            <p className="text-[#777] text-sm">
                                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button 
                                    onClick={() => {
                                        setView(view === 'login' ? 'register' : 'login');
                                        setServerError('');
                                    }} 
                                    className="text-[var(--color-primary)] font-medium hover:underline"
                                >
                                    {view === 'login' ? 'Create Account' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
