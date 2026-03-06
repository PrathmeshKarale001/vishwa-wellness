"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Home, ShoppingBag, Package, User, Search, Sparkles, TrendingUp,
    BookOpen, MapPin, Heart, Loader2, ArrowRight, Flame, X, Clock
} from "lucide-react";
import { client } from "@/lib/sanity";
import { allProductsQuery } from "@/lib/sanity.queries";
import { Product, ProductImage } from "@/types";

// Extended Product type that may include Sanity _id and category object
interface SearchProduct extends Omit<Product, 'category'> {
    _id?: string;
    category?: string | { name: string; slug: string };
}

interface GlobalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ShoppingBag, label: "Shop", href: "/shop" },
    { icon: Package, label: "My Orders", href: "/account/orders" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: User, label: "My Account", href: "/account" },
];

const quickLinks = [
    { icon: BookOpen, label: "About Us", href: "/about" },
    { icon: Flame, label: "Bhasma Rituals", href: "/bhasma-rituals" },
    { icon: Sparkles, label: "DIY Recipes", href: "/diy-recipes" },
    { icon: MapPin, label: "Agnihotra Wellness Retreats", href: "/awt-retreats" },
];

const trendingSearches = [
    { term: "Sacred ash water", icon: Sparkles },
    { term: "Bath ritual", icon: Flame },
    { term: "Healing balm", icon: Heart },
    { term: "Face pack", icon: Sparkles },
];

/**
 * Global Search / Command Palette
 * Premium redesign with modern UI
 */
export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [products, setProducts] = React.useState<SearchProduct[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Focus input when opened
    React.useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    // Load recent searches
    React.useEffect(() => {
        const saved = localStorage.getItem('vishwa-recent-searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Fetch products when search opens
    React.useEffect(() => {
        if (open) {
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    const data = await client.fetch(allProductsQuery);
                    setProducts(data);
                } catch (error) {
                    console.error("Failed to fetch search products:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [open]);

    const handleSelect = (href: string) => {
        onOpenChange(false);
        setSearch("");
        router.push(href);
    };

    const handleSearch = (term: string) => {
        setSearch(term);
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('vishwa-recent-searches', JSON.stringify(updated));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('vishwa-recent-searches');
    };



    // Filter products based on search term
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (typeof p.category === 'string'
            ? p.category.toLowerCase().includes(search.toLowerCase())
            : p.category?.name?.toLowerCase?.().includes(search.toLowerCase()))
    ).slice(0, 5);

    // Handle keyboard shortcut
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
            if (e.key === "Escape") {
                onOpenChange(false);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300"
                onClick={() => onOpenChange(false)}
            />

            {/* Search Dialog */}
            <div className="fixed left-1/2 top-[10%] z-[100] w-full max-w-2xl -translate-x-1/2 px-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[80vh]">

                    {/* Premium Search Input */}
                    <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                <Search className="text-[var(--color-primary)]" size={20} />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products, rituals, or recipes..."
                                className="flex-1 text-lg bg-transparent focus:outline-none placeholder:text-gray-400"
                            />
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-5">
                        {search.trim().length > 1 ? (
                            // Search Results
                            <div>
                                {filteredProducts.length > 0 ? (
                                    <>
                                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                            <Sparkles size={14} className="text-[var(--color-primary)]" />
                                            <span>{filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &quot;{search}&quot;</span>
                                        </p>
                                        <div className="space-y-2">
                                            {filteredProducts.map((product) => (
                                                <button
                                                    key={product.id || product._id}
                                                    onClick={() => handleSelect(`/products/${product.slug}`)}
                                                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[var(--color-primary)]/5 rounded-xl transition-all group text-left"
                                                >
                                                    <div className="w-14 h-14 bg-white rounded-xl relative flex-shrink-0 shadow-sm overflow-hidden">
                                                        {product.images?.[0] && (
                                                            <img
                                                                src={product.images[0].url || product.images[0].src || ''}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {product.category && (
                                                            <span className="inline-block px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider rounded-full mb-1">
                                                                {typeof product.category === 'string' ? product.category : product.category.name}
                                                            </span>
                                                        )}
                                                        <p className="font-semibold text-gray-900 truncate group-hover:text-[var(--color-primary)] transition-colors">
                                                            {product.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="font-bold text-gray-900">
                                                                ₹{Math.round(product.price).toLocaleString()}
                                                            </span>
                                                            {product.comparePrice && (
                                                                <>
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        ₹{Math.round(product.comparePrice).toLocaleString()}
                                                                    </span>
                                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                                                        {product.discount}% OFF
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all text-gray-400">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleSelect(`/shop?search=${encodeURIComponent(search)}`)}
                                            className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                                        >
                                            <span>View all results</span>
                                            <ArrowRight size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                            <Search size={28} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium mb-2">No results found for &quot;{search}&quot;</p>
                                        <p className="text-sm text-gray-400">
                                            Try a different search term or browse our collections
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Default State - Navigation & Quick Links
                            <div className="space-y-8">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div>
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
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Navigation</h4>
                                    <div className="space-y-1">
                                        {navigationItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.href + item.label}
                                                    onClick={() => handleSelect(item.href)}
                                                    className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group text-left"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-colors">
                                                        <Icon size={20} className="text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
                                                    </div>
                                                    <span className="font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Links</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {quickLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <button
                                                    key={link.href}
                                                    onClick={() => handleSelect(link.href)}
                                                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group text-left"
                                                >
                                                    <Icon size={18} className="text-[var(--color-primary)]" />
                                                    <span className="font-medium text-gray-700 group-hover:text-[var(--color-primary)] transition-colors text-sm">{link.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Trending Searches */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                                        <TrendingUp size={14} className="text-[var(--color-primary)]" />
                                        Trending Searches
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {trendingSearches.map((item, index) => {
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
                                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded font-mono text-gray-500">⌘K</kbd>
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
        </>
    );
}

/**
 * Hook to use the global search
 */
export function useGlobalSearch() {
    const [open, setOpen] = React.useState(false);

    return {
        open,
        setOpen,
        toggle: () => setOpen((prev) => !prev),
    };
}
