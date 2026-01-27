'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    X,
    TrendingUp,
    Clock,
    ArrowRight,
    Sparkles,
    Home,
    ShoppingBag,
    Package,
    Heart,
    User,
    BookOpen,
    Flame,
    MapPin
} from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

// Sample products for search (in real app, this would come from API/CMS)
const searchableProducts = [
    {
        id: 'agni-jal',
        slug: 'agni-jal-sacred-ash-water',
        title: 'Agni Jal™ Sacred Ash Water',
        category: 'Pāna',
        price: 599,
        discount: 25,
        image: '/products/agni-jal.jpg',
    },
    {
        id: 'bhasma-body-cleanser',
        slug: 'bhasma-body-cleanser',
        title: 'Bhasma Body Cleanser',
        category: 'Snān',
        price: 449,
        image: '/products/cleanser.jpg',
    },
    {
        id: 'lepam-healing-balm',
        slug: 'lepam-healing-balm',
        title: 'Lepam Healing Balm',
        category: 'Lepam',
        price: 649,
        discount: 10,
        image: '/products/balm.jpg',
    },
    {
        id: 'sacred-space-mist',
        slug: 'sacred-space-mist',
        title: 'Sacred Space Mist',
        category: 'Home & Aura',
        price: 399,
        image: '/products/mist.jpg',
    },
    {
        id: 'ritual-bath-powder',
        slug: 'ritual-bath-powder',
        title: 'Ritual Bath Powder',
        category: 'Snān',
        price: 799,
        discount: 15,
        image: '/products/bath-powder.jpg',
    },
    {
        id: 'ash-face-pack',
        slug: 'ash-face-pack',
        title: 'Ash Face Pack',
        category: 'Lepam',
        price: 549,
        image: '/products/face-pack.jpg',
    },
];

const popularSearches = [
    { term: 'Sacred ash water', icon: Sparkles },
    { term: 'Bath ritual', icon: Flame },
    { term: 'Healing balm', icon: Heart },
    { term: 'Face pack', icon: Sparkles },
];

const navigationLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'My Orders', href: '/account', icon: Package },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'My Account', href: '/account', icon: User },
];

const quickLinks = [
    { label: 'About Us', href: '/about', icon: BookOpen },
    { label: 'Bhasma Rituals', href: '/bhasma-rituals', icon: Flame },
    { label: 'DIY Recipes', href: '/diy-recipes', icon: Sparkles },
    { label: 'AWT Retreats', href: '/awt-retreats', icon: MapPin },
];

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<typeof searchableProducts>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { addItem } = useCartStore();

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('vishwa-recent-searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Search logic
    useEffect(() => {
        if (query.trim().length > 1) {
            const searchTerm = query.toLowerCase();
            const filtered = searchableProducts.filter(
                product =>
                    product.title.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSearch = (searchTerm: string) => {
        setQuery(searchTerm);
        // Save to recent searches
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('vishwa-recent-searches', JSON.stringify(updated));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('vishwa-recent-searches');
    };

    const handleClose = () => {
        setQuery('');
        setResults([]);
        onClose();
    };

    const getDiscountedPrice = (price: number, discount?: number) => {
        if (!discount) return price;
        return Math.round(price - (price * discount / 100));
    };

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-12 md:pt-20 transition-all duration-300"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Premium Search Input */}
                <div className="relative p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                            <Search className="text-[var(--color-primary)]" size={20} />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products, rituals, or recipes..."
                            className="w-full pl-16 pr-12 py-4 text-lg bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-gray-400"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results / Suggestions */}
                <div className="flex-1 overflow-y-auto">
                    {query.trim().length > 1 ? (
                        // Show results
                        <div className="p-5">
                            {results.length > 0 ? (
                                <>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                        <Sparkles size={14} className="text-[var(--color-primary)]" />
                                        <span>{results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;</span>
                                    </p>
                                    <div className="space-y-2">
                                        {results.map(product => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug}`}
                                                onClick={handleClose}
                                                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-[var(--color-primary)]/5 rounded-xl transition-all group"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-xl relative flex-shrink-0 shadow-sm overflow-hidden">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="inline-block px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider rounded-full mb-1">
                                                        {product.category}
                                                    </span>
                                                    <p className="font-semibold text-gray-900 truncate group-hover:text-[var(--color-primary)] transition-colors">
                                                        {product.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="font-bold text-gray-900">
                                                            ₹{getDiscountedPrice(product.price, product.discount)}
                                                        </span>
                                                        {product.discount && (
                                                            <>
                                                                <span className="text-sm text-gray-400 line-through">
                                                                    ₹{product.price}
                                                                </span>
                                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                                                    {product.discount}% OFF
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/shop?search=${encodeURIComponent(query)}`}
                                        onClick={handleClose}
                                        className="flex items-center justify-center gap-2 mt-4 py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                                    >
                                        <span>View all results</span>
                                        <ArrowRight size={18} />
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <Search size={28} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 font-medium mb-2">No results found for &quot;{query}&quot;</p>
                                    <p className="text-sm text-gray-400">
                                        Try a different search term or browse our collections
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show suggestions
                        <div className="p-5">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <Clock size={14} />
                                            Recent Searches
                                        </h4>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((term, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSearch(term)}
                                                className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Navigation</h4>
                                <div className="space-y-1">
                                    {navigationLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.href + link.label}
                                                href={link.href}
                                                onClick={handleClose}
                                                className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-colors">
                                                    <Icon size={20} className="text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
                                                </div>
                                                <span className="font-medium group-hover:text-gray-900 transition-colors">{link.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Links</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={handleClose}
                                                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group"
                                            >
                                                <Icon size={18} className="text-[var(--color-primary)]" />
                                                <span className="font-medium text-gray-700 group-hover:text-[var(--color-primary)] transition-colors text-sm">{link.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Popular Searches */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                                    <TrendingUp size={14} className="text-[var(--color-primary)]" />
                                    Trending Searches
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleSearch(item.term)}
                                                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all"
                                            >
                                                <Icon size={14} />
                                                {item.term}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with keyboard hints */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span className="font-semibold uppercase tracking-widest">Vishwa Wellness Global Search</span>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white border border-gray-200 rounded font-mono text-gray-500">CMD+K</kbd>
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white border border-gray-200 rounded font-mono text-gray-500">ESC</kbd>
                            <span>to close</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
