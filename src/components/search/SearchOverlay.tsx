'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
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
    'Sacred ash water',
    'Bath ritual',
    'Healing balm',
    'Face pack',
];

const quickLinks = [
    { label: 'Bhasma Rituals', href: '/bhasma-rituals' },
    { label: 'DIY Recipes', href: '/diy-recipes' },
    { label: 'AWT Retreats', href: '/awt-retreats' },
    { label: 'Shop All', href: '/shop' },
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
            className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16 md:pt-24 transition-opacity"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-3xl mx-4 bg-white max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="relative border-b border-[#eee]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={22} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products, rituals, recipes..."
                        className="w-full pl-12 pr-12 py-4 text-lg focus:outline-none"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#333]"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Search Results / Suggestions */}
                <div className="flex-1 overflow-y-auto">
                    {query.trim().length > 1 ? (
                        // Show results
                        <div className="p-4">
                            {results.length > 0 ? (
                                <>
                                    <p className="text-sm text-[#999] mb-4">
                                        {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                                    </p>
                                    <div className="space-y-3">
                                        {results.map(product => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.slug}`}
                                                onClick={handleClose}
                                                className="flex items-center gap-4 p-3 hover:bg-[#f9f9f9] transition-colors"
                                            >
                                                <div className="w-16 h-16 bg-[#f5f2f2] relative flex-shrink-0">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-[var(--color-primary)] mb-1">
                                                        {product.category}
                                                    </p>
                                                    <p className="font-medium text-[#222] truncate">
                                                        {product.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="font-semibold text-[#222]">
                                                            ₹{getDiscountedPrice(product.price, product.discount)}
                                                        </span>
                                                        {product.discount && (
                                                            <span className="text-sm text-[#999] line-through">
                                                                ₹{product.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="text-[#999]" size={18} />
                                            </Link>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/shop?search=${encodeURIComponent(query)}`}
                                        onClick={handleClose}
                                        className="block mt-4 text-center py-3 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    >
                                        View all results
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-[#777] mb-4">No results found for &quot;{query}&quot;</p>
                                    <p className="text-sm text-[#999]">
                                        Try a different search term or browse our collections
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show suggestions
                        <div className="p-4">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium text-[#222] flex items-center gap-2">
                                            <Clock size={16} className="text-[#999]" />
                                            Recent Searches
                                        </h4>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-[#999] hover:text-[var(--color-primary)]"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((term, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSearch(term)}
                                                className="px-3 py-1.5 bg-[#f5f5f5] text-[#666] text-sm hover:bg-[#eee] transition-colors"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Searches */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-[#222] flex items-center gap-2 mb-3">
                                    <TrendingUp size={16} className="text-[var(--color-primary)]" />
                                    Popular Searches
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((term, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSearch(term)}
                                            className="px-3 py-1.5 border border-[#ddd] text-[#666] text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="text-sm font-medium text-[#222] mb-3">Quick Links</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={handleClose}
                                            className="px-4 py-3 bg-[#f9f9f9] text-[#666] text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors text-center"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-white hover:text-[var(--color-primary)] transition-colors"
                onClick={handleClose}
            >
                <X size={32} />
            </button>
        </div>
    );
}
