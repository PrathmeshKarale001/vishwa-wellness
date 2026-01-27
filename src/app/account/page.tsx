'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Package, Heart, MapPin, Settings, LogOut, Star, TrendingUp, Clock, Award } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';

const dashboardLinks = [
    { icon: Package, label: 'My Orders', href: '/account/orders', desc: 'Track & manage orders', color: 'from-[var(--color-primary)] to-[var(--color-primary-dark)]' },
    { icon: Star, label: 'My Reviews', href: '/account/reviews', desc: 'Share your experience', color: 'from-amber-600 to-amber-700' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', desc: 'Saved for later', color: 'from-orange-600 to-orange-700' },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses', desc: 'Manage delivery locations', color: 'from-gray-700 to-gray-800' },
    { icon: Settings, label: 'Settings', href: '/account/settings', desc: 'Profile & preferences', color: 'from-stone-600 to-stone-700' },
];

function AccountDashboard() {
    const router = useRouter();
    const { user, profile, signOut } = useAuthStore();

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const firstName = displayName.split(' ')[0];
    const userInitial = displayName.charAt(0).toUpperCase();
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : '';

    return (
        <>
            {/* Hero Section with Integrated Breadcrumb */}
            <div className="bg-[var(--color-bg-cream)] text-[var(--color-dark)] pt-8 pb-24 relative overflow-hidden border-b border-gray-100">
                {/* Decorative Background Elements - Lightened */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600 opacity-5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    {/* Modern Light Breadcrumb */}
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-12">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                        <ChevronRight size={10} className="text-gray-300" />
                        <span className="text-gray-600">Account Dashboard</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-end gap-10 text-center md:text-left">
                        {/* Avatar Container - Light Mode Optimized */}
                        <div className="relative group">
                            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center border border-gray-100 shadow-xl group-hover:scale-105 transition-all duration-500 overflow-hidden group-hover:rounded-2xl">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-5xl font-bold font-[family-name:var(--font-playfair)] text-[var(--color-primary)]">
                                        {userInitial}
                                    </span>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--color-gold)] rounded-xl flex items-center justify-center border-4 border-white shadow-xl transition-transform duration-300 hover:rotate-12">
                                <Award size={20} className="text-white" />
                            </div>
                        </div>

                        {/* User Info Container */}
                        <div className="flex-1 pb-2">
                            <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
                                <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-gray-100 shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                                        Verified Member
                                    </div>
                                    {profile?.dosha_type && (
                                        <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-[var(--color-primary)]/10 capitalize">
                                            {profile.dosha_type} Dosha
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)] tracking-tight leading-none text-black">
                                Welcome back,<br className="md:hidden" /> <span className="text-[var(--color-primary)] italic">{firstName}</span>
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-gray-500 text-[13px] font-semibold justify-center md:justify-start mt-6">
                                <span className="flex items-center gap-2.5 group cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                                    <div className="p-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <User size={14} className="text-[var(--color-primary)]" />
                                    </div>
                                    {user?.email}
                                </span>
                                <span className="hidden md:block w-px h-4 bg-gray-200"></span>
                                <span className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <Clock size={14} className="text-[var(--color-primary)]" />
                                    </div>
                                    Joined {memberSince}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-16 bg-[#fcfcfc] min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-24 relative z-20">
                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                                    <Package className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-4xl font-bold text-gray-900 group-hover:scale-105 origin-left transition-transform duration-500">0</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Total Orders</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300">
                                    <Heart className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <Clock className="w-4 h-4 text-gray-300" />
                            </div>
                            <p className="text-4xl font-bold text-gray-900 group-hover:scale-105 origin-left transition-transform duration-500">0</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Wishlist</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                                    <Star className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <Award className="w-4 h-4 text-amber-500 animate-bounce" />
                            </div>
                            <p className="text-4xl font-bold text-gray-900 group-hover:scale-105 origin-left transition-transform duration-500">0</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Reviews</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center group-hover:bg-stone-700 transition-colors duration-300">
                                    <MapPin className="w-6 h-6 text-stone-700 group-hover:text-white transition-colors duration-300" />
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-gray-900 group-hover:scale-105 origin-left transition-transform duration-500">0</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Addresses</p>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dashboardLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="flex items-start gap-6">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${link.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <link.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-gray-900 mb-2 font-[family-name:var(--font-playfair)] group-hover:text-[var(--color-primary)] transition-colors">
                                            {link.label}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{link.desc}</p>
                                        <div className="flex items-center text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest">
                                            <span>Manage Access</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Logout Card */}
                        <button
                            onClick={handleLogout}
                            className="group bg-white rounded-[2rem] p-10 border border-red-50 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_90px_rgba(255,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 text-left"
                        >
                            <div className="flex flex-col gap-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                                    <LogOut className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl text-gray-900 mb-3 font-[family-name:var(--font-playfair)] group-hover:text-red-600 transition-colors">
                                        Sign Out
                                    </h3>
                                    <p className="text-gray-500 mb-6 leading-relaxed">Securely logout from your session</p>
                                    <div className="flex items-center text-red-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        <span>Exit Account</span>
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-3 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Wellness Tip - Light Mode Optimized */}
                    <div className="mt-16 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
                            <div className="w-24 h-24 bg-[var(--color-primary)]/5 rounded-[2rem] flex items-center justify-center flex-shrink-0 border border-[var(--color-primary)]/10 group-hover:rotate-12 transition-transform duration-700">
                                <Award className="w-12 h-12 text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-2xl text-gray-900 mb-3 font-[family-name:var(--font-playfair)]">Ritual of the Day</h3>
                                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl font-light">
                                    "Start your day with a glass of warm water infused with sacred ash to balance your doshas and ignite your inner digestive fire."
                                </p>
                                <div className="mt-6 flex items-center gap-3 justify-center md:justify-start">
                                    <div className="h-px w-8 bg-[var(--color-primary)]"></div>
                                    <span className="text-[var(--color-primary)] text-xs font-bold tracking-[0.3em] uppercase">Vishwa Wisdom</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function AccountPage() {
    return (
        <AuthGuard>
            <AccountDashboard />
        </AuthGuard>
    );
}
