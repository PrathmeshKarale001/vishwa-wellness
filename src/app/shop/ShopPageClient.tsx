'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { Product } from '@/types';
import { Category } from '@/lib/sanity.types';



const categories = [
    { name: 'All Products', slug: 'all', count: 8 },
    { name: 'Snān Collection', slug: 'snan', count: 2 },
    { name: 'Lepam Collection', slug: 'lepam', count: 2 },
    { name: 'Pāna Collection', slug: 'pana', count: 1 },
    { name: 'Home & Aura', slug: 'home', count: 2 },
    { name: 'Kits & Bundles', slug: 'kit', count: 1 },
];

const priceRanges = [
    { label: 'Under ₹300', min: 0, max: 300 },
    { label: '₹300 - ₹500', min: 300, max: 500 },
    { label: '₹500 - ₹800', min: 500, max: 800 },
    { label: 'Above ₹800', min: 800, max: 10000 },
];

interface ShopPageProps {
    products: Product[];
    categories?: Category[];
}

export default function ShopPage({ products = [], categories: sanityCategories = [] }: ShopPageProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        ritual: true,
    });

    // Use passed products
    const displayProducts = products;

    // Compute category counts dynamically from actual products
    const getCategoryCount = (slug: string): number => {
        if (slug === 'all') return displayProducts.length;
        return displayProducts.filter(p =>
            p.category?.toLowerCase() === slug.toLowerCase() ||
            p.ritualType?.toLowerCase() === slug.toLowerCase() ||
            p.tags?.some(t => t.toLowerCase() === slug.toLowerCase())
        ).length;
    };

    // Build dynamic categories from Sanity data or use fallback with live counts
    const displayCategories = sanityCategories.length > 0
        ? [
            { name: 'All Products', slug: 'all', count: displayProducts.length },
            ...sanityCategories.map(cat => ({
                name: cat.name,
                slug: cat.slug,
                count: getCategoryCount(cat.slug)
            }))
        ]
        : categories.map(cat => ({
            ...cat,
            count: getCategoryCount(cat.slug)
        }));

    // Filter products - match by category name, slug, ritualType, or tags
    const filteredProducts = displayProducts.filter((product: Product) => {
        if (selectedCategory !== 'all') {
            const categoryMatch =
                product.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                product.ritualType?.toLowerCase() === selectedCategory.toLowerCase() ||
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

            {/* Ritual Type */}
            <div className="pb-6">
                <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => toggleSection('ritual')}
                >
                    <h4 className="font-semibold text-[#222] uppercase text-sm tracking-wider">Ritual Type</h4>
                    {expandedSections.ritual ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.ritual && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['Snān', 'Lepam', 'Pāna', 'Home'].map((ritual) => (
                            <button
                                key={ritual}
                                onClick={() => setSelectedCategory(ritual.toLowerCase().replace('ā', 'a'))}
                                className={`px-3 py-1 border text-sm transition-colors ${selectedCategory === ritual.toLowerCase().replace('ā', 'a')
                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                    : 'border-[#ddd] text-[#777] hover:border-[var(--color-primary)]'
                                    }`}
                            >
                                {ritual}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'all' || selectedPrice) && (
                <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );

    return (
        <>
            {/* Premium Shop Hero */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 bg-[var(--color-navy)]" />
                <div className="absolute inset-0 z-0">
                    <img
                        src="/package-1.jpg"
                        alt="Shop Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy)] via-[var(--color-navy)]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-transparent to-[var(--color-navy)]/70" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <span>/</span>
                                <span className="text-white">Shop</span>
                            </div>

                            <div className="inline-block px-4 py-1 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 mb-6">
                                <span className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.2em]">Sacred Collection</span>
                            </div>

                            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6 leading-[1.1] drop-shadow-lg">
                                Agni-Infused™<br />
                                <span className="text-[var(--color-accent)]">Products</span>
                            </h1>

                            <p className="text-lg text-white/80 max-w-lg mb-8 leading-relaxed">
                                Discover our collection of sacred ash products, each prepared through the ancient Agni-Saṃskāra process to carry the transformative energy of sacred fire.
                            </p>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">8+</div>
                                    <div className="text-xs text-white/60 uppercase tracking-wider">Products</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">3</div>
                                    <div className="text-xs text-white/60 uppercase tracking-wider">Ritual Types</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">500+</div>
                                    <div className="text-xs text-white/60 uppercase tracking-wider">Happy Customers</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Featured Product Cards Preview (hidden on mobile) */}
                        <div className="hidden lg:block">
                            <div className="grid grid-cols-2 gap-8 transform rotate-3">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform -rotate-3 hover:scale-105 transition-transform text-white">
                                    <div className="aspect-square bg-white/10 rounded-xl mb-3 overflow-hidden">
                                        <img src="/agnijal.jpg" alt="Agni Jal" className="w-full h-full object-cover" />
                                    </div>
                                    <h4 className="font-semibold text-sm">Agni Jal™</h4>
                                    <p className="text-white/60 text-xs">Sacred Ash Water</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform translate-y-8 -rotate-3 hover:scale-105 transition-transform text-white">
                                    <div className="aspect-square bg-white/10 rounded-xl mb-3 overflow-hidden">
                                        <img src="/package-2.jpg" alt="Healing Paste" className="w-full h-full object-cover" />
                                    </div>
                                    <h4 className="font-semibold text-sm">Lepam Paste</h4>
                                    <p className="text-white/60 text-xs">Healing Therapy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
