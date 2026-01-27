'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft, ChevronRight, Heart, Share2, ShoppingCart, Check,
    Truck, Shield, RotateCcw, Award, Minus, Plus, Play, ChevronDown
} from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import { ProductTrustBadges } from '@/components/ui/trust-badges';
import { StickyAddToCart } from '@/components/ui/sticky-add-to-cart';
import { showToast } from '@/components/ui/toast';
import Breadcrumbs, { BreadcrumbConfigs } from '@/components/ui/breadcrumbs';
import ProductReviews from '@/components/product/ProductReviews';

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

// Feature highlights for wellness products
const productFeatures = [
    { icon: Shield, label: '100% Natural', desc: 'Ayurvedic Formula' },
    { icon: Award, label: 'AYUSH Certified', desc: 'Quality Assured' },
    { icon: Truck, label: 'Free Shipping', desc: 'Orders above ₹999' },
    { icon: RotateCcw, label: 'Easy Returns', desc: '7 Day Policy' },
];

export default function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailProps) {
    const detailSections: InfoSection[] = product.sections || [];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description');
    const [addedToCart, setAddedToCart] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

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
        showToast.success('Added to cart!', {
            description: `${quantity}x ${product.title}`
        });
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

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const text = `Check out ${product.title} on Vishwa Wellness!`;

        if (navigator.share) {
            try {
                await navigator.share({ title: product.title, text, url });
            } catch {
                navigator.clipboard.writeText(url);
            }
        } else {
            navigator.clipboard.writeText(url);
            showToast.success('Link copied to clipboard!');
        }
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    const toggleAccordion = (section: string) => {
        setExpandedAccordion(expandedAccordion === section ? null : section);
    };

    // Build accordion items from sections with explicit typing
    type AccordionItem = {
        id: string;
        title: string;
        content: string;
        listItems?: string[];
        ingredients?: Ingredient[];
        layout?: 'text' | 'benefits' | 'ingredients' | 'usage' | 'certifications';
    };

    const accordionItems: AccordionItem[] = [
        {
            id: 'description',
            title: 'Description',
            content: product.description || product.benefitHeadline || 'Premium Ayurvedic supplement crafted with traditional wisdom and modern science.'
        },
        ...detailSections.map((section, idx) => ({
            id: `section-${idx}`,
            title: section.title,
            content: section.content || section.listItems?.join('\n') || '',
            listItems: section.listItems,
            ingredients: section.ingredients,
            layout: section.layout
        }))
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F7]">
            {/* Breadcrumbs */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <Breadcrumbs
                    items={BreadcrumbConfigs.product(
                        product.title,
                        product.category?.name,
                        product.category?.slug
                    )}
                />
            </div>

            {/* Main Product Section */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                    {/* Left Side - Image Gallery */}
                    <div className="flex gap-4 lg:w-[55%]">
                        {/* Vertical Thumbnails */}
                        <div className="hidden sm:flex flex-col gap-3 w-20">
                            {images.slice(0, 6).map((img, idx) => (
                                <button
                                    key={img._key || idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200
                                        ${currentImageIndex === idx
                                            ? 'border-[#1a1a1a] shadow-md'
                                            : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.alt || `${product.title} thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                    {idx === 1 && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <Play className="w-5 h-5 text-white" fill="white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 relative">
                            <div
                                className={`relative aspect-[4/5] bg-[#f0efed] rounded-xl overflow-hidden cursor-zoom-in
                                    ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                                onClick={() => setIsZoomed(!isZoomed)}
                            >
                                {images.length > 0 ? (
                                    <Image
                                        src={images[currentImageIndex]?.url}
                                        alt={images[currentImageIndex]?.alt || product.title}
                                        fill
                                        className={`object-contain transition-transform duration-300
                                            ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <ShoppingCart className="w-16 h-16 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">No image available</p>
                                        </div>
                                    </div>
                                )}

                                {/* Badges */}
                                {(product.isNew || product.isBestSeller || discount > 0) && (
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.isNew && (
                                            <span className="px-3 py-1 bg-[#1a1a1a] text-white text-xs font-medium rounded-full">
                                                NEW
                                            </span>
                                        )}
                                        {product.isBestSeller && (
                                            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                                ★ Bestseller
                                            </span>
                                        )}
                                        {discount > 0 && (
                                            <span className="px-3 py-1 bg-[#c25c5c] text-white text-xs font-medium rounded-full">
                                                {discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 
                                                     backdrop-blur-sm rounded-full flex items-center justify-center
                                                     shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100
                                                     hover:scale-105"
                                            style={{ opacity: 1 }}
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 
                                                     backdrop-blur-sm rounded-full flex items-center justify-center
                                                     shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100
                                                     hover:scale-105"
                                            style={{ opacity: 1 }}
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Thumbnails */}
                            <div className="flex sm:hidden gap-2 mt-4 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={img._key || idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all
                                            ${currentImageIndex === idx
                                                ? 'border-[#1a1a1a]'
                                                : 'border-gray-200'
                                            }`}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.alt || `Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="lg:w-[45%] lg:sticky lg:top-24 lg:self-start">
                        {/* Category */}
                        {product.category && (
                            <Link
                                href={`/shop?category=${product.category.slug}`}
                                className="text-[#8b7355] text-sm font-medium tracking-wide uppercase hover:underline"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        {/* Title */}
                        <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-[#1a1a1a] leading-tight">
                            {product.title}
                        </h1>

                        {/* Subtitle */}
                        {product.benefitHeadline && (
                            <p className="mt-3 text-[#666] text-base leading-relaxed">
                                {product.benefitHeadline}
                            </p>
                        )}

                        {/* Price */}
                        <div className="mt-6 flex items-baseline gap-3">
                            <span className="text-3xl font-semibold text-[#1a1a1a]">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.comparePrice && (
                                <>
                                    <span className="text-lg text-[#999] line-through">
                                        ₹{product.comparePrice.toLocaleString()}
                                    </span>
                                    <span className="text-sm font-medium text-[#c25c5c]">
                                        Save ₹{(product.comparePrice - product.price).toLocaleString()}
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-[#888]">
                            Inclusive of all taxes
                        </p>

                        {/* Quantity & Actions */}
                        <div className="mt-8 space-y-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-[#ddd] rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-[#666] 
                                                 hover:bg-[#f5f5f5] transition-colors rounded-l-lg"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium text-[#1a1a1a]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center text-[#666] 
                                                 hover:bg-[#f5f5f5] transition-colors rounded-r-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-[#1a1a1a] font-medium">
                                    ₹{(product.price * quantity).toLocaleString()}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={stock === 0}
                                    className={`flex-1 h-14 rounded-lg font-medium text-base flex items-center justify-center gap-2
                                              transition-all duration-200
                                              ${stock === 0
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : addedToCart
                                                ? 'bg-green-600 text-white'
                                                : 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                                        }`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleWishlist}
                                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center
                                              transition-all duration-200
                                              ${isWishlisted
                                            ? 'border-red-400 bg-red-50 text-red-500'
                                            : 'border-[#ddd] hover:border-[#1a1a1a] text-[#666]'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="w-14 h-14 rounded-lg border-2 border-[#ddd] flex items-center justify-center
                                             text-[#666] hover:border-[#1a1a1a] transition-all duration-200"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Stock Status */}
                            {stock > 0 && stock <= 10 && (
                                <p className="text-sm text-amber-600 font-medium">
                                    Only {stock} left in stock
                                </p>
                            )}
                        </div>

                        {/* Feature Icons */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {productFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f5f3f0] flex items-center justify-center flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-[#8b7355]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1a1a1a]">{feature.label}</p>
                                        <p className="text-xs text-[#888]">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Accordion Sections */}
                        <div className="mt-10 border-t border-[#e5e5e5]">
                            {accordionItems.map((item) => (
                                <div key={item.id} className="border-b border-[#e5e5e5]">
                                    <button
                                        onClick={() => toggleAccordion(item.id)}
                                        className="w-full py-5 flex items-center justify-between text-left"
                                    >
                                        <span className="font-medium text-[#1a1a1a]">{item.title}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-[#666] transition-transform duration-200
                                                      ${expandedAccordion === item.id ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {expandedAccordion === item.id && (
                                        <div className="pb-5 text-[#666] text-sm leading-relaxed animate-fadeIn">
                                            {item.layout === 'ingredients' && item.ingredients ? (
                                                <ul className="space-y-3">
                                                    {item.ingredients.map((ing, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#8b7355] mt-2 flex-shrink-0" />
                                                            <div>
                                                                <span className="font-medium text-[#1a1a1a]">{ing.name}</span>
                                                                {ing.sanskritName && (
                                                                    <span className="text-[#8b7355] ml-1">({ing.sanskritName})</span>
                                                                )}
                                                                {ing.description && (
                                                                    <p className="mt-0.5 text-[#888] text-xs">{ing.description}</p>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : item.listItems && item.listItems.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {item.listItems.map((li, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#8b7355] mt-2 flex-shrink-0" />
                                                            <span>{li}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="whitespace-pre-line">{item.content}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="bg-white py-16 mt-12">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                        <h2 className="text-2xl font-serif text-[#1a1a1a] mb-8">
                            You May Also Like
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.slice(0, 4).map((item) => (
                                <Link
                                    key={item._id}
                                    href={`/products/${item.slug}`}
                                    className="group"
                                >
                                    <div className="relative aspect-[4/5] bg-[#f5f3f0] rounded-xl overflow-hidden mb-3">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                <ShoppingCart className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-medium text-[#1a1a1a] line-clamp-2 group-hover:underline">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-[#666]">
                                        ₹{item.price.toLocaleString()}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Product Reviews Section */}
            <section className="bg-white py-16">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                    <ProductReviews
                        productId={product._id}
                        productName={product.title}
                    />
                </div>
            </section>

            {/* Sticky Mobile Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e5] p-4 lg:hidden z-40">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-[#888]">Total</p>
                        <p className="text-lg font-semibold text-[#1a1a1a]">
                            ₹{(product.price * quantity).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                        className={`flex-1 h-12 rounded-lg font-medium text-sm flex items-center justify-center gap-2
                                  ${stock === 0
                                ? 'bg-gray-200 text-gray-500'
                                : addedToCart
                                    ? 'bg-green-600 text-white'
                                    : 'bg-[#1a1a1a] text-white'
                            }`}
                    >
                        {addedToCart ? 'Added!' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Trust Badges Section */}
            <div className="mt-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <ProductTrustBadges className="max-w-md" />
            </div>

            {/* Bottom padding for mobile sticky bar */}
            <div className="h-24 lg:hidden" />

            {/* Mobile Sticky Add to Cart */}
            <StickyAddToCart
                product={{
                    name: product.title,
                    price: product.price,
                    comparePrice: product.comparePrice,
                    image: images[0]?.url,
                    inStock: stock > 0,
                }}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
                isInWishlist={isWishlisted}
                isLoading={addedToCart}
            />
        </div>
    );
}
