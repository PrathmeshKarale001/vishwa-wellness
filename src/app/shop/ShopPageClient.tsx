'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { Hero } from '@/components/ui/Hero';
import { Product } from '@/types';
import { Category } from '@/lib/sanity.types';



const priceRanges = [
    { label: 'Under ₹300', min: 0, max: 300 },
    { label: '₹300 - ₹500', min: 300, max: 500 },
    { label: '₹500 - ₹800', min: 500, max: 800 },
    { label: 'Above ₹800', min: 800, max: 10000 },
];

interface ShopPageProps {
    products: Product[];
    categories?: Category[];
    initialCategory?: string;
}

export default function ShopPage({ products = [], categories: sanityCategories = [], initialCategory = 'all' }: ShopPageProps) {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
    });

    // Use passed products
    const displayProducts = products;

    // Compute category counts dynamically from actual products
    // Matches by category slug or tags
    const getCategoryCount = (slug: string): number => {
        if (slug === 'all') return displayProducts.length;
        return displayProducts.filter(p =>
            p.categorySlug?.toLowerCase() === slug.toLowerCase() ||
            p.tags?.some(t => t.toLowerCase() === slug.toLowerCase())
        ).length;
    };

    // Build dynamic categories from Sanity data - fully dynamic, no hardcoded fallback
    const displayCategories = [
        { name: 'All Products', slug: 'all', count: displayProducts.length },
        ...sanityCategories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            count: getCategoryCount(cat.slug)
        }))
    ];

    // Filter products - match by category slug or tags
    const filteredProducts = displayProducts.filter((product: Product) => {
        if (selectedCategory !== 'all') {
            const categoryMatch =
                product.categorySlug?.toLowerCase() === selectedCategory.toLowerCase() ||
                product.tags?.some(t => t.toLowerCase() === selectedCategory.toLowerCase());
            if (!categoryMatch) return false;
        }
        if (selectedPrice) {
            const productPrice = Math.round(product.price);
            if (productPrice < selectedPrice.min || productPrice > selectedPrice.max) {
                return false;
            }
        }
        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'popular':
                return (b.reviewCount || 0) - (a.reviewCount || 0);
            default:
                return 0;
        }
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedPrice(null);
    };

    const Sidebar = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div className="border-b border-[#eee] pb-6">
                <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => toggleSection('categories')}
                >
                    <h4 className="font-semibold text-[#222] uppercase text-sm tracking-wider">Categories</h4>
                    {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.categories && (
                    <ul className="mt-4 space-y-2">
                        {displayCategories.map((cat) => (
                            <li key={cat.slug}>
                                <button
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={`flex items-center justify-between w-full py-1 text-sm transition-colors ${selectedCategory === cat.slug
                                        ? 'text-[var(--color-primary)] font-medium'
                                        : 'text-[#777] hover:text-[var(--color-primary)]'
                                        }`}
                                >
                                    <span>{cat.name}</span>
                                    <span className="text-xs text-[#999]">({cat.count})</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Price Range */}
            <div className="border-b border-[#eee] pb-6">
                <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => toggleSection('price')}
                >
                    <h4 className="font-semibold text-[#222] uppercase text-sm tracking-wider">Price</h4>
                    {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.price && (
                    <ul className="mt-4 space-y-2">
                        {priceRanges.map((range, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => setSelectedPrice(
                                        selectedPrice?.min === range.min ? null : { min: range.min, max: range.max }
                                    )}
                                    className={`flex items-center gap-2 py-1 text-sm transition-colors ${selectedPrice?.min === range.min
                                        ? 'text-[var(--color-primary)] font-medium'
                                        : 'text-[#777] hover:text-[var(--color-primary)]'
                                        }`}
                                >
                                    <span className={`w-4 h-4 border rounded flex items-center justify-center ${selectedPrice?.min === range.min
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                                        : 'border-[#ddd]'
                                        }`}>
                                        {selectedPrice?.min === range.min && (
                                            <span className="text-white text-xs">✓</span>
                                        )}
                                    </span>
                                    {range.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'all' || selectedPrice) && (
                <button
                    onClick={clearFilters}
                    className="btn-outline w-full py-2"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );

    return (
        <>
            {/* Premium Shop Hero */}
            <Hero
                theme="dark"
                badge="Sacred Collection"
                title="Agni-Infused™"
                highlight="Products"
                description="Discover our collection of sacred ash products, each prepared through the ancient Agni-Saṃskāra process to carry the transformative energy of sacred fire."
                bgImage="/package-1.jpg"
                minHeight="min-h-[60vh]"
            >
                {/* Quick Stats Overlay (Optional but nice to keep) */}
                <div className="flex flex-wrap gap-6 justify-center mt-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">8+</div>
                        <div className="text-xs text-white/60 uppercase tracking-wider">Products</div>
                    </div>
                    <div className="w-px bg-white/20 hidden sm:block" />
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">3</div>
                        <div className="text-xs text-white/60 uppercase tracking-wider">Ritual Types</div>
                    </div>
                    <div className="w-px bg-white/20 hidden sm:block" />
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">500+</div>
                        <div className="text-xs text-white/60 uppercase tracking-wider">Happy Customers</div>
                    </div>
                </div>
            </Hero>

            {/* Shop Content */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-8">
                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <Sidebar />
                        </aside>

                        {/* Products Area */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#eee]">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#ddd] text-sm"
                                >
                                    <SlidersHorizontal size={16} />
                                    Filters
                                </button>

                                {/* Results Count */}
                                <p className="text-sm text-[#777]">
                                    Showing <strong>{sortedProducts.length}</strong> products
                                </p>

                                {/* View Toggle & Sort */}
                                <div className="flex items-center gap-4">
                                    {/* View Toggle */}
                                    <div className="hidden sm:flex items-center gap-1 border border-[#ddd] p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1 ${viewMode === 'grid' ? 'bg-[#222] text-white' : 'text-[#777]'}`}
                                        >
                                            <Grid3X3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1 ${viewMode === 'list' ? 'bg-[#222] text-white' : 'text-[#777]'}`}
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 border border-[#ddd] text-sm text-[#777] bg-white focus:outline-none focus:border-[var(--color-primary)]"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="popular">Most Popular</option>
                                    </select>
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(selectedCategory !== 'all' || selectedPrice) && (
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <span className="text-sm text-[#777]">Active Filters:</span>
                                    {selectedCategory !== 'all' && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-[#f5f2f2] text-sm">
                                            {displayCategories.find((c) => c.slug === selectedCategory)?.name}
                                            <button onClick={() => setSelectedCategory('all')}>
                                                <X size={14} />
                                            </button>
                                        </span>
                                    )}
                                    {selectedPrice && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-[#f5f2f2] text-sm">
                                            {priceRanges.find((r) => r.min === selectedPrice.min)?.label}
                                            <button onClick={() => setSelectedPrice(null)}>
                                                <X size={14} />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Products Grid */}
                            {sortedProducts.length > 0 ? (
                                <div className={`grid gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-2 md:grid-cols-3'
                                    : 'grid-cols-1'
                                    }`}>
                                    {sortedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-[#777] mb-4">No products found matching your filters.</p>
                                    <button onClick={clearFilters} className="btn-outline">
                                        Clear Filters
                                    </button>
                                </div>
                            )}

                            {/* Load More */}
                            {sortedProducts.length > 0 && (
                                <div className="text-center mt-10">
                                    <button className="btn-solid">
                                        Load More Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity ${mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform lg:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-[#222]">Filters</h3>
                    <button onClick={() => setMobileSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                    <Sidebar />
                </div>
            </div>
        </>
    );
}
