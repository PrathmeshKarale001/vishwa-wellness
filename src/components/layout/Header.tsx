'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, Mail, ChevronDown, LogOut, Package, Settings, Command } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import { GlobalSearch } from '@/components/ui';
import type { Category } from '@/lib/sanity.types';

interface NavItem {
    name: string;
    href: string;
    dropdown?: { name: string; href: string }[];
}

// Static navigation items (non-shop items)
const staticNavItems: NavItem[] = [
    { name: 'Home', href: '/' },
    {
        name: 'Knowledge',
        href: '#',
        dropdown: [
            { name: 'Why Ash?', href: '/why-ash' },
            { name: 'The Science', href: '/science-mysticism' },
            { name: 'DIY Recipes', href: '/diy-recipes' },
        ]
    },
    {
        name: 'Rituals',
        href: '#',
        dropdown: [
            { name: 'Bhasma Rituals', href: '/bhasma-rituals' },
            { name: 'Ash Water', href: '/ash-water' },
            { name: 'Retreats', href: '/awt-retreats' },
        ]
    },
    { name: 'Gallery', href: '/gallery' },
    {
        name: 'About',
        href: '/about',
        dropdown: [
            { name: 'Our Story', href: '/about' },
            { name: 'Contact', href: '/contact' },
        ]
    },
];

interface HeaderProps {
    categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
    const [isSticky, setIsSticky] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { openCart, getItemCount } = useCartStore();
    const { user, profile, signOut, isInitialized } = useAuthStore();
    const itemCount = mounted ? getItemCount() : 0;

    // Build dynamic shop dropdown from Sanity categories
    const shopDropdown = [
        { name: 'All Products', href: '/shop' },
        ...(categories || []).map(cat => ({
            name: cat.name,
            href: `/shop?category=${cat.slug}`,
        })),
    ];

    // Build navigation items with dynamic shop dropdown
    const navItems: NavItem[] = [
        staticNavItems[0], // Home
        {
            name: 'Shop',
            href: '/shop',
            dropdown: shopDropdown,
        },
        staticNavItems[1], // Knowledge
        staticNavItems[2], // Rituals
        staticNavItems[3], // Gallery
        staticNavItems[4], // About
    ];

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.user-dropdown-container')) {
                setUserDropdownOpen(false);
            }
            if (!target.closest('.nav-dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        setUserDropdownOpen(false);
        await signOut();
        // Force page refresh to clear all cached state
        window.location.href = '/';
    };

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <>
            {/* Top Bar */}
            <div className="bg-[#f8f8f8] border-b border-[#eee] hidden lg:block">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-10 text-xs text-[#999]">
                        <div className="flex items-center gap-6">
                            <a href="tel:+917447489101" className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors">
                                <Phone size={12} />
                                <span>+91 74474 89101</span>
                            </a>
                            <a href="mailto:crm@vishwaglobal.com" className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors">
                                <Mail size={12} />
                                <span>crm@vishwaglobal.com</span>
                            </a>
                        </div>
                        <div className="flex items-center gap-6">
                            <span>Free Shipping on all orders</span>
                            <span className="text-[#bbb]">|</span>
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors"
                            >
                                <Command size={10} />
                                <span>K</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header
                className={`bg-white transition-all duration-300 z-50 ${isSticky ? 'fixed top-0 left-0 right-0 shadow-md' : ''
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Vishwa Wellness"
                                width={180}
                                height={50}
                                className="h-12 w-auto"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative group h-20 flex items-center nav-dropdown-container"
                                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                                    onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#333] hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {item.name}
                                        {item.dropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                                    </Link>

                                    {/* Dropdown */}
                                    {item.dropdown && (
                                        <div
                                            className={`absolute top-full left-0 bg-white shadow-lg border border-gray-100 min-w-[200px] py-2 z-50 transition-all duration-200 ${activeDropdown === item.name
                                                ? 'opacity-100 translate-y-0 pointer-events-auto'
                                                : 'opacity-0 translate-y-2 pointer-events-none'
                                                }`}
                                        >
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block px-4 py-2 text-sm text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center gap-1">
                            <button
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search (⌘K)"
                            >
                                <Search size={20} />
                            </button>
                            <Link
                                href="/wishlist"
                                className="w-10 h-10 hidden sm:flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors relative"
                            >
                                <Heart size={20} />
                            </Link>

                            {/* User Menu */}
                            <div className="relative user-dropdown-container hidden sm:block">
                                {mounted && isInitialized && user ? (
                                    // Logged in - show user dropdown
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        {profile?.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt={displayName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {userInitial}
                                            </div>
                                        )}
                                    </button>
                                ) : (
                                    // Not logged in - show login link
                                    <Link
                                        href="/account/login"
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <User size={20} />
                                    </Link>
                                )}

                                {/* User Dropdown */}
                                {userDropdownOpen && user && (
                                    <div className="absolute right-0 top-full mt-2 bg-white shadow-lg border border-gray-100 min-w-[200px] py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-medium text-[#222] text-sm">{displayName}</p>
                                            <p className="text-xs text-[#777] truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/account"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <User size={16} />
                                            My Account
                                        </Link>
                                        <Link
                                            href="/account/orders"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <Package size={16} />
                                            My Orders
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <Heart size={16} />
                                            Wishlist
                                        </Link>
                                        <Link
                                            href="/account/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={openCart}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors relative"
                                aria-label="Open cart"
                            >
                                <ShoppingCart size={20} />
                                {itemCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sticky Header Spacer */}
            {isSticky && <div className="h-20" />}

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <Image src="/logo.png" alt="Vishwa Wellness" width={140} height={40} className="h-10 w-auto" />
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Mobile User Info */}
                {mounted && user && (
                    <div className="p-4 bg-[#f9f9f9] border-b">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-medium">
                                {userInitial}
                            </div>
                            <div>
                                <p className="font-medium text-[#222] text-sm">{displayName}</p>
                                <p className="text-xs text-[#777] truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="py-4 overflow-y-auto h-[calc(100%-80px)]">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            <Link
                                href={item.href}
                                className="block px-6 py-3 text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                            {item.dropdown && (
                                <div className="bg-[#f9f9f9]">
                                    {item.dropdown.map((subItem) => (
                                        <Link
                                            key={subItem.name}
                                            href={subItem.href}
                                            className="block px-10 py-2 text-sm text-[#666] hover:text-[var(--color-primary)] transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Mobile Auth Links */}
                    <div className="border-t mt-4 pt-4">
                        {mounted && user ? (
                            <>
                                <Link
                                    href="/account"
                                    className="flex items-center gap-3 px-6 py-3 text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <User size={18} />
                                    My Account
                                </Link>
                                <Link
                                    href="/account/orders"
                                    className="flex items-center gap-3 px-6 py-3 text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Package size={18} />
                                    My Orders
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 transition-colors w-full"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/account/login"
                                    className="flex items-center gap-3 px-6 py-3 text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <User size={18} />
                                    Login
                                </Link>
                                <Link
                                    href="/account/register"
                                    className="flex items-center gap-3 px-6 py-3 text-[#333] hover:bg-[#f9f9f9] hover:text-[var(--color-primary)] transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <User size={18} />
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {/* Global Search Command Palette */}
            <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
        </>
    );
}
