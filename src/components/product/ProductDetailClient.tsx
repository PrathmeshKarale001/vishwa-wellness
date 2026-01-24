'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft, ChevronRight, Heart, Share2, ShoppingCart, Check,
    Truck, Shield, RotateCcw, Star, Package, Award, Leaf, Clock,
    ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Copy, Facebook,
    Twitter, MessageCircle, AlertCircle, Minus, Plus
} from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';

interface Ingredient {
    name: string;
    scientificName?: string;
    sanskritName?: string;
    benefits?: string[];
    description?: string;
}

interface InfoSection {
    title: string;
    layout: 'text' | 'benefits' | 'ingredients' | 'usage' | 'certifications';
    content?: string;
    listItems?: string[];
    ingredients?: Ingredient[];
}

interface ProductImage {
    _key: string;
    url: string;
    alt?: string;
}

interface RelatedProduct {
    _id: string;
    title: string;
    slug: string;
    price: number;
    comparePrice?: number;
    image?: string;
}

interface ProductDetailProps {
    product: {
        _id: string;
        title: string;
        slug: string;
        sku?: string;
        description?: string;
        benefitHeadline?: string;
        price: number;
        comparePrice?: number;
        stock?: number;
        images?: ProductImage[];
        category?: { name: string; slug: string };
        ritualType?: string;
        isNew?: boolean;
        isSale?: boolean;
        isBestSeller?: boolean;
        tags?: string[];
        sections?: InfoSection[];
    };
    relatedProducts?: RelatedProduct[];
}

// Mock reviews data - in production, this would come from your database
const mockReviews = [
    {
        id: 1, name: 'Priya Sharma', rating: 5, date: '2 weeks ago', verified: true,
        comment: 'Excellent product! I\'ve been using it for a month and already feeling the difference. The quality is top-notch and delivery was super fast.',
        helpful: 24, images: []
    },
    {
        id: 2, name: 'Rahul Verma', rating: 4, date: '1 month ago', verified: true,
        comment: 'Good product overall. Started seeing results after 3 weeks of consistent use. Would recommend to others.',
        helpful: 18, images: []
    },
    {
        id: 3, name: 'Ananya Patel', rating: 5, date: '1 month ago', verified: true,
        comment: 'This is my second purchase. The Ayurvedic formulation really works. No side effects and very effective.',
        helpful: 31, images: []
    },
];

const faqs = [
    { q: 'How long before I see results?', a: 'Most customers notice improvements within 2-4 weeks of consistent use, though individual results may vary.' },
    { q: 'Are there any side effects?', a: 'Our products are made from 100% natural Ayurvedic ingredients with no known side effects. However, consult your physician if you have specific health concerns.' },
    { q: 'Can I take this with other medications?', a: 'We recommend consulting your healthcare provider before combining with prescription medications.' },
    { q: 'What is the recommended dosage?', a: 'Please refer to the "How to Use" section for detailed dosage instructions specific to this product.' },
];

export default function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailProps) {
    const detailSections: InfoSection[] = product.sections || [];

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [reviewFilter, setReviewFilter] = useState<number | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);

    const { addItem } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    const isWishlisted = isInWishlist(product._id);
    const images = product.images || [];
    const stock = product.stock ?? 100;
    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    const handleAddToCart = () => {
        const cartProduct = {
            id: product._id,
            slug: product.slug,
            title: product.title,
            description: product.description || '',
            price: product.price,
            comparePrice: product.comparePrice,
            images: images.map((img: ProductImage, idx: number) => ({
                id: img._key || String(idx),
                src: img.url,
                alt: img.alt || product.title
            })),
            stock: stock,
        };
        addItem(cartProduct as any, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist({
                id: product._id,
                slug: product.slug,
                title: product.title,
                description: product.description || '',
                price: product.price,
                comparePrice: product.comparePrice,
                category: product.category?.name || '',
                tags: product.tags || [],
                images: images.map((img, idx) => ({
                    id: img._key || String(idx),
                    src: img.url,
                    alt: img.alt || product.title
                })),
                stock: stock,
            } as any);
        }
    };

    const handleShare = (platform: string) => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const text = `Check out ${product.title} on Vishwa Wellness!`;

        const shareUrls: Record<string, string> = {
            copy: url,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } else {
            window.open(shareUrls[platform], '_blank');
        }
        setShowShareMenu(false);
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    const activeSection = detailSections[activeTabIndex];

    // Calculate rating stats
    const avgRating = (mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length).toFixed(1);
    const ratingCounts = [5, 4, 3, 2, 1].map(star => mockReviews.filter(r => r.rating === star).length);

    return (
        <div className="min-h-screen bg-[#f9f9f9]">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-[var(--color-primary)]">Shop</Link>
                        {product.category && (
                            <>
                                <span>/</span>
                                <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[var(--color-primary)]">
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-[#333] font-medium">{product.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery - Sticky on desktop */}
                    <div className="lg:sticky lg:top-4 lg:self-start space-y-4">
                        <div className="relative aspect-square bg-white rounded-xl overflow-hidden border shadow-sm">
                            {images.length > 0 ? (
                                <Image
                                    src={images[currentImageIndex]?.url || '/placeholder.jpg'}
                                    alt={images[currentImageIndex]?.alt || product.title}
                                    fill
                                    className="object-contain p-6"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#999]">
                                    <Package size={64} className="opacity-30" />
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isNew && (
                                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">NEW</span>
                                )}
                                {product.isBestSeller && (
                                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">⭐ BESTSELLER</span>
                                )}
                                {discount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">{discount}% OFF</span>
                                )}
                            </div>

                            {/* Zoom hint */}
                            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                                Click to zoom
                            </div>

                            {/* Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={img._key || idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${idx === currentImageIndex
                                            ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Image src={img.url} alt="" width={80} height={80} className="object-cover w-full h-full" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title & Rating */}
                        <div>
                            {product.category && (
                                <Link href={`/shop?category=${product.category.slug}`} className="text-sm text-[var(--color-primary)] font-medium hover:underline">
                                    {product.category.name}
                                </Link>
                            )}
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#222] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                {product.title}
                            </h1>
                            {product.benefitHeadline && (
                                <p className="text-[#666] text-lg mt-2">{product.benefitHeadline}</p>
                            )}

                            {/* Rating Summary */}
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} className={i < Math.floor(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                    ))}
                                    <span className="ml-2 font-semibold text-[#333]">{avgRating}</span>
                                    <span className="text-[#777]">({mockReviews.length} reviews)</span>
                                </div>
                                {product.sku && <span className="text-xs text-[#999] bg-gray-100 px-2 py-1 rounded">SKU: {product.sku}</span>}
                            </div>
                        </div>

                        {/* Price Block */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <span className="text-4xl font-bold text-[var(--color-primary)]">₹{product.price.toLocaleString()}</span>
                                {product.comparePrice && (
                                    <>
                                        <span className="text-xl text-[#999] line-through">₹{product.comparePrice.toLocaleString()}</span>
                                        <span className="bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-full">
                                            Save ₹{(product.comparePrice - product.price).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-[#666] mt-2">Inclusive of all taxes • Free shipping on orders above ₹999</p>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {stock > 10 ? (
                                <>
                                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-green-600 font-medium">In Stock</span>
                                    <span className="text-[#777]">- Ready to ship</span>
                                </>
                            ) : stock > 0 ? (
                                <>
                                    <AlertCircle size={18} className="text-amber-500" />
                                    <span className="text-amber-600 font-medium">Only {stock} left!</span>
                                    <span className="text-[#777]">- Order soon</span>
                                </>
                            ) : (
                                <>
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center border-2 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                        disabled={quantity >= stock}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={stock === 0}
                                    className={`flex-1 min-w-[200px] py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${addedToCart
                                        ? 'bg-green-500 text-white'
                                        : stock === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:shadow-lg'
                                        }`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check size={24} />
                                            Added to Cart!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={24} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Secondary Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleWishlist}
                                    className={`flex items-center gap-2 px-5 py-3 border-2 rounded-lg font-medium transition-all ${isWishlisted
                                        ? 'border-red-500 bg-red-50 text-red-600'
                                        : 'border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                                        }`}
                                >
                                    <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-lg font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
                                    >
                                        <Share2 size={20} />
                                        Share
                                    </button>
                                    {showShareMenu && (
                                        <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-xl p-2 z-10 min-w-[160px]">
                                            <button onClick={() => handleShare('copy')} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 rounded text-sm">
                                                <Copy size={16} /> Copy Link
                                            </button>
                                            <button onClick={() => handleShare('facebook')} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 rounded text-sm">
                                                <Facebook size={16} /> Facebook
                                            </button>
                                            <button onClick={() => handleShare('twitter')} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 rounded text-sm">
                                                <Twitter size={16} /> Twitter
                                            </button>
                                            <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 rounded text-sm">
                                                <MessageCircle size={16} /> WhatsApp
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges - Premium Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: Truck, title: 'Free Shipping', desc: 'Above ₹999' },
                                { icon: Shield, title: '100% Authentic', desc: 'Genuine Products' },
                                { icon: RotateCcw, title: 'Easy Returns', desc: '7 Day Policy' },
                                { icon: Award, title: 'Certified', desc: 'Ayush Approved' },
                            ].map((badge, idx) => (
                                <div key={idx} className="bg-white border rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                                    <badge.icon className="mx-auto text-[var(--color-primary)] mb-2" size={28} />
                                    <p className="font-semibold text-[#333] text-sm">{badge.title}</p>
                                    <p className="text-xs text-[#777]">{badge.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Key Highlights */}
                        <div className="bg-white border rounded-xl p-5">
                            <h3 className="font-bold text-[#222] mb-4 flex items-center gap-2">
                                <Leaf className="text-green-600" size={20} />
                                Why Choose This Product?
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['100% Natural Ingredients', 'Clinically Tested', 'No Side Effects', 'Fast Acting Formula', 'GMP Certified', 'Vegetarian Friendly'].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <Check size={16} className="text-green-600 flex-shrink-0" />
                                        <span className="text-[#555]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabbed Description Section */}
                {detailSections.length > 0 && (
                    <div className="mt-12 bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="flex overflow-x-auto border-b bg-gray-50 scrollbar-hide">
                            {detailSections.map((section, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTabIndex(idx)}
                                    className={`flex-shrink-0 px-6 py-4 font-semibold text-sm transition-all ${activeTabIndex === idx
                                        ? 'bg-white text-[var(--color-primary)] border-b-3 border-[var(--color-primary)] -mb-px'
                                        : 'text-[#666] hover:text-[var(--color-primary)] hover:bg-white/50'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 md:p-8 min-h-[300px]">
                            {activeSection?.layout === 'text' && (
                                <div className="prose max-w-none">
                                    <p className="text-[#555] whitespace-pre-line leading-relaxed text-lg">{activeSection.content}</p>
                                </div>
                            )}

                            {activeSection?.layout === 'benefits' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {activeSection.listItems?.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="text-white" size={18} />
                                            </div>
                                            <span className="text-[#333] font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeSection?.layout === 'ingredients' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {activeSection.ingredients?.map((ing, idx) => (
                                        <div key={idx} className="border rounded-xl p-5 hover:shadow-lg transition-all bg-gradient-to-br from-white to-orange-50/30">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-bold text-lg text-[#222]">{ing.name}</h4>
                                                    {ing.scientificName && (
                                                        <p className="text-sm text-[#666] italic">{ing.scientificName}</p>
                                                    )}
                                                </div>
                                                {ing.sanskritName && (
                                                    <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                                                        {ing.sanskritName}
                                                    </span>
                                                )}
                                            </div>
                                            {ing.benefits && (
                                                <ul className="space-y-2 mt-4">
                                                    {ing.benefits.map((b, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-[#555]">
                                                            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full mt-2 flex-shrink-0" />
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeSection?.layout === 'usage' && (
                                <div className="max-w-2xl">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                                                <Clock size={24} />
                                            </div>
                                            <h4 className="font-bold text-xl text-[#222]">How to Use</h4>
                                        </div>
                                        <p className="text-[#555] whitespace-pre-line leading-relaxed text-lg">{activeSection.content}</p>
                                    </div>
                                </div>
                            )}

                            {activeSection?.layout === 'certifications' && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {activeSection.listItems?.map((label, idx) => (
                                        <div key={idx} className="text-center p-6 bg-gradient-to-b from-green-50 to-white rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Award className="text-green-600" size={32} />
                                            </div>
                                            <p className="font-semibold text-[#333]">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Customer Reviews Section */}
                <div className="mt-12 bg-white rounded-xl border shadow-sm p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
                        {/* Rating Summary */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl text-center md:min-w-[200px]">
                            <div className="text-5xl font-bold text-[#222]">{avgRating}</div>
                            <div className="flex justify-center gap-1 my-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className={i < Math.floor(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                ))}
                            </div>
                            <p className="text-[#666]">Based on {mockReviews.length} reviews</p>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((star, idx) => (
                                <button
                                    key={star}
                                    onClick={() => setReviewFilter(reviewFilter === star ? null : star)}
                                    className={`flex items-center gap-3 w-full group ${reviewFilter === star ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <span className="text-sm w-8">{star} ★</span>
                                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all"
                                            style={{ width: `${(ratingCounts[idx] / mockReviews.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-[#666] w-8">{ratingCounts[idx]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Write Review CTA */}
                        <div className="text-center">
                            <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {mockReviews
                            .filter(r => reviewFilter === null || r.rating === reviewFilter)
                            .map((review) => (
                                <div key={review.id} className="border-b pb-6 last:border-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[#222]">{review.name}</span>
                                                {review.verified && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Check size={12} /> Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-[#999]">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[#555] leading-relaxed">{review.comment}</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button className="flex items-center gap-2 text-sm text-[#777] hover:text-[var(--color-primary)]">
                                            <ThumbsUp size={16} /> Helpful ({review.helpful})
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-[#777] hover:text-red-500">
                                            <ThumbsDown size={16} /> Not helpful
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12 bg-white rounded-xl border shadow-sm p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-[#222] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 text-left font-medium text-[#333] hover:bg-gray-50"
                                >
                                    {faq.q}
                                    {expandedFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {expandedFaq === idx && (
                                    <div className="p-4 pt-0 text-[#666] border-t bg-gray-50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Products - Would need actual data */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-[#222] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.slice(0, 4).map((rp) => (
                                <Link key={rp._id} href={`/product/${rp.slug}`} className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow group">
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                        {rp.image && <Image src={rp.image} alt={rp.title} width={200} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                                    </div>
                                    <h3 className="font-medium text-[#333] line-clamp-2 mb-2">{rp.title}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-[var(--color-primary)]">₹{rp.price}</span>
                                        {rp.comparePrice && <span className="text-sm text-[#999] line-through">₹{rp.comparePrice}</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Mobile Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden z-40">
                <div className="flex items-center gap-4">
                    <div>
                        <span className="text-2xl font-bold text-[var(--color-primary)]">₹{product.price}</span>
                        {product.comparePrice && <span className="text-sm text-[#999] line-through ml-2">₹{product.comparePrice}</span>}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                        className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
