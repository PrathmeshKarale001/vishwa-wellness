'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Package, Heart, MapPin, Settings, LogOut, Star } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';

const dashboardLinks = [
    { icon: Package, label: 'My Orders', href: '/account/orders', desc: 'View order history' },
    { icon: Star, label: 'My Reviews', href: '/account/reviews', desc: 'Write & manage reviews' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', desc: 'Saved items' },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses', desc: 'Manage shipping addresses' },
    { icon: Settings, label: 'Account Settings', href: '/account/settings', desc: 'Profile & preferences' },
];

function AccountDashboard() {
    const router = useRouter();
    const { user, profile, signOut } = useAuthStore();

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : '';

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">My Account</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        My Account
                    </h1>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#eee] p-6">
                                {/* User Info */}
                                <div className="text-center pb-6 border-b border-[#eee]">
                                    <div className="w-20 h-20 bg-[#f5f2f2] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                                        {profile?.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt={displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={36} className="text-[#999]" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-[#222]">{displayName}</h3>
                                    <p className="text-sm text-[#777]">{user?.email}</p>
                                    {memberSince && (
                                        <p className="text-xs text-[#999] mt-1">Member since {memberSince}</p>
                                    )}
                                    {profile?.dosha_type && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-[var(--color-cream)] text-[var(--color-primary)] text-xs rounded-full capitalize">
                                            {profile.dosha_type} Dosha
                                        </span>
                                    )}
                                </div>

                                {/* Navigation */}
                                <nav className="mt-6 space-y-2">
                                    {dashboardLinks.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-3 px-3 py-2 text-[#777] hover:text-[var(--color-primary)] hover:bg-[#f9f9f9] transition-colors"
                                        >
                                            <link.icon size={18} />
                                            <span className="text-sm">{link.label}</span>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 transition-colors w-full"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Welcome Card */}
                            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white p-6">
                                <h2 className="text-xl font-semibold mb-2">Welcome back, {displayName.split(' ')[0]}!</h2>
                                <p className="opacity-90 text-sm">
                                    Manage your orders, wishlist, and account settings from your dashboard.
                                </p>
                            </div>

                            {/* Quick Links Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                {dashboardLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="bg-white border border-[#eee] p-5 hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
                                    >
                                        <link.icon size={24} className="text-[var(--color-primary)] mb-3" />
                                        <h3 className="font-medium text-[#222] group-hover:text-[var(--color-primary)]">
                                            {link.label}
                                        </h3>
                                        <p className="text-sm text-[#777] mt-1">{link.desc}</p>
                                    </Link>
                                ))}
                            </div>

                            {/* Account Summary */}
                            <div className="bg-white border border-[#eee] p-6">
                                <h3 className="font-semibold text-[#222] mb-4">Account Summary</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-[#f9f9f9]">
                                        <Package className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-[#222]">0</p>
                                        <p className="text-sm text-[#777]">Orders</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#f9f9f9]">
                                        <Heart className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-[#222]">0</p>
                                        <p className="text-sm text-[#777]">Wishlist Items</p>
                                    </div>
                                    <div className="text-center p-4 bg-[#f9f9f9]">
                                        <MapPin className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-[#222]">0</p>
                                        <p className="text-sm text-[#777]">Addresses</p>
                                    </div>
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
