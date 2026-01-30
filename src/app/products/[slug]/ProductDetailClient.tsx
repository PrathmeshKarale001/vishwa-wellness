'use client';

import { useState, useEffect } from 'react';
import { Product, Ingredient, InfoSection } from '@/types';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import StarRating from '@/components/product/StarRating';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import { Heart, Share2, Truck, RotateCcw, ShieldCheck, Minus, Plus, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [quantity, setQuantity] = useState(1);
    const [expandedSection, setExpandedSection] = useState<string | null>('description');
    const [activeReviewTab, setActiveReviewTab] = useState<'reviews'>('reviews');

    const { addItem } = useCartStore();
    const { isInWishlist, addToWishlist, removeFromWishlist, syncWithServer } = useWishlist();
    const isWishlisted = isInWishlist(product.id);

    useEffect(() => {
        syncWithServer();
    }, [syncWithServer]);

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
    };

    const discount = product.comparePrice && product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    const formattedImages = product.images.map((img) => ({
        url: img.url || img.src || '',
        alt: img.alt || product.title,
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[var(--color-primary)]">Shop</Link>
                    <span>/</span>
                    <Link href={`/shop?category=${product.category}`} className="hover:text-[var(--color-primary)]">
                        {product.category}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.title}</span>
                </nav>
            </div>

            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Image Gallery */}
                    <div>
                        <ProductImageGallery images={formattedImages} productName={product.title} />
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                {product.title}
                            </h1>
                            {product.shortDescription && (
                                <p className="text-lg text-gray-600 mb-4">{product.shortDescription}</p>
                            )}
                            <div className="flex items-center gap-4">
                                <StarRating
                                    rating={product.rating || 0}
                                    size="md"
                                    showNumber
                                    reviewCount={product.reviewCount || 0}
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="border-t border-b border-gray-200 py-4">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-900">
                                    ₹{Math.round(product.price).toLocaleString()}
                                </span>
                                {product.comparePrice && product.comparePrice > product.price && (
                                    <>
                                        <span className="text-2xl text-gray-400 line-through">
                                            ₹{Math.round(product.comparePrice).toLocaleString()}
                                        </span>
                                        <span className="text-lg font-semibold text-green-600">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.stock > 0 ? (
                                <>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-green-700 font-medium">
                                        In Stock ({product.stock} available)
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-red-700 font-medium">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-6 py-2 font-semibold text-gray-900 min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 btn-solid py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                                className={`p-4 border-2 rounded-lg transition-all ${isWishlisted
                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                aria-label="Add to wishlist"
                            >
                                <Heart
                                    className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-600'
                                        }`}
                                />
                            </button>
                            <button
                                className="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                aria-label="Share product"
                            >
                                <Share2 className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                <Truck className="w-8 h-8 text-[var(--color-primary)] flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">Free Shipping</p>
                                    <p className="text-xs text-gray-600">On orders above ₹499</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                <RotateCcw className="w-8 h-8 text-[var(--color-primary)] flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">Easy Returns</p>
                                    <p className="text-xs text-gray-600">30-day return policy</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                <ShieldCheck className="w-8 h-8 text-[var(--color-primary)] flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">100% Authentic</p>
                                    <p className="text-xs text-gray-600">Certified products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion Sections */}
                <div className="mt-16">
                    <div className="border-t border-gray-200">
                        {product.sections && product.sections.map((section, index) => (
                            <div key={index} className="border-b border-gray-200">
                                <button
                                    onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
                                    className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 px-4 transition-colors"
                                >
                                    <span className="font-semibold text-lg text-gray-900">{section.title}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${expandedSection === section.title ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {expandedSection === section.title && (
                                    <div className="pb-6 px-4 text-gray-700 text-sm leading-relaxed animate-fadeIn">
                                        {section.layout === 'ingredients' && section.ingredients ? (
                                            <ul className="space-y-4">
                                                {section.ingredients.map((ing, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <span className="font-semibold text-gray-900 text-base">{ing.name}</span>
                                                            {ing.sanskritName && (
                                                                <span className="text-[var(--color-primary)] ml-2 text-sm italic">({ing.sanskritName})</span>
                                                            )}
                                                            {ing.scientificName && (
                                                                <p className="text-xs text-gray-500 mt-0.5 italic">{ing.scientificName}</p>
                                                            )}
                                                            {ing.description && (
                                                                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{ing.description}</p>
                                                            )}
                                                            {ing.benefits && ing.benefits.length > 0 && (
                                                                <ul className="mt-2 space-y-1">
                                                                    {ing.benefits.map((benefit, bidx) => (
                                                                        <li key={bidx} className="flex items-start gap-2 text-xs">
                                                                            <span className="text-green-600 mt-0.5">✓</span>
                                                                            <span className="text-gray-600">{benefit}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : section.listItems && section.listItems.length > 0 ? (
                                            <ul className="space-y-2">
                                                {section.listItems.map((li, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                                                        <span className="flex-1">{li}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="whitespace-pre-line leading-relaxed">{section.content}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Reviews Section */}
                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => setExpandedSection(expandedSection === 'reviews' ? null : 'reviews')}
                                className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 px-4 transition-colors"
                            >
                                <span className="font-semibold text-lg text-gray-900">
                                    Reviews ({product.reviewCount || 0})
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${expandedSection === 'reviews' ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {expandedSection === 'reviews' && (
                                <div className="pb-6 px-4">
                                    <ReviewsSection
                                        productId={product.id}
                                        initialRating={product.rating}
                                        initialReviewCount={product.reviewCount}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
