'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, Share2, ShoppingCart, Check, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

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
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
    // Get sections from product
    const detailSections: InfoSection[] = product.sections || [];

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();

    const images = product.images || [];
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
            images: images.map((img: ProductImage, idx: number) => ({ id: img._key || String(idx), src: img.url, alt: img.alt || product.title })),
            stock: product.stock || 100,
        };
        addItem(cartProduct as any, quantity);
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    const activeSection = detailSections[activeTabIndex];

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
                        <span className="text-[#333]">{product.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
                            {images.length > 0 ? (
                                <Image
                                    src={images[currentImageIndex]?.url || '/placeholder.jpg'}
                                    alt={images[currentImageIndex]?.alt || product.title}
                                    fill
                                    className="object-contain p-4"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#999]">
                                    No image available
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isNew && (
                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">NEW</span>
                                )}
                                {product.isBestSeller && (
                                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded">BESTSELLER</span>
                                )}
                                {discount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">{discount}% OFF</span>
                                )}
                            </div>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={img._key || idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${idx === currentImageIndex ? 'border-[var(--color-primary)]' : 'border-transparent'
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
                            <h1 className="text-2xl md:text-3xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                {product.title}
                            </h1>
                            {product.benefitHeadline && (
                                <p className="text-[#666] text-lg">{product.benefitHeadline}</p>
                            )}
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                    ))}
                                    <span className="text-sm text-[#666] ml-2">(124 reviews)</span>
                                </div>
                                {product.sku && <span className="text-xs text-[#999]">SKU: {product.sku}</span>}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-[#f5f5f5] to-white p-4 rounded-lg border">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-[var(--color-primary)]">₹{product.price}</span>
                                {product.comparePrice && (
                                    <>
                                        <span className="text-lg text-[#999] line-through">₹{product.comparePrice}</span>
                                        <span className="text-green-600 font-semibold">Save ₹{product.comparePrice - product.price}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-[#777] mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 min-w-[200px] bg-[var(--color-primary)] text-white py-3 px-6 rounded font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button className="w-12 h-12 border rounded flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
                                <Heart size={20} />
                            </button>
                            <button className="w-12 h-12 border rounded flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-y">
                            <div className="text-center">
                                <Truck className="mx-auto text-[var(--color-primary)] mb-1" size={24} />
                                <p className="text-xs text-[#666]">Free Shipping<br />Above ₹999</p>
                            </div>
                            <div className="text-center">
                                <Shield className="mx-auto text-[var(--color-primary)] mb-1" size={24} />
                                <p className="text-xs text-[#666]">100% Authentic<br />Products</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw className="mx-auto text-[var(--color-primary)] mb-1" size={24} />
                                <p className="text-xs text-[#666]">Easy Returns<br />& Refunds</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabbed Description Section */}
                <div className="mt-12 bg-white rounded-lg border overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex overflow-x-auto border-b bg-[#f9f9f9]">
                        {detailSections.map((section, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTabIndex(idx)}
                                className={`flex-shrink-0 px-6 py-4 font-medium text-sm transition-colors ${activeTabIndex === idx
                                    ? 'bg-white text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                                    : 'text-[#666] hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-8 min-h-[300px]">
                        {!activeSection && (
                            <div className="flex items-center justify-center h-full text-[#999]">
                                Select a tab for more details.
                            </div>
                        )}

                        {activeSection?.layout === 'text' && (
                            <div className="prose max-w-none">
                                <p className="text-[#555] whitespace-pre-line leading-relaxed">{activeSection.content}</p>
                            </div>
                        )}

                        {activeSection?.layout === 'benefits' && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {activeSection.listItems?.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                                        <span className="text-[#333]">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection?.layout === 'ingredients' && (
                            <div className="space-y-6">
                                {activeSection.ingredients?.map((ing, idx) => (
                                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-[#222]">{ing.name}</h4>
                                                {ing.scientificName && (
                                                    <p className="text-sm text-[#666] italic">{ing.scientificName}</p>
                                                )}
                                            </div>
                                            {ing.sanskritName && (
                                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                                    {ing.sanskritName}
                                                </span>
                                            )}
                                        </div>
                                        {ing.benefits && (
                                            <ul className="space-y-1 mt-3">
                                                {ing.benefits.map((b, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-[#555]">
                                                        <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {ing.description && (
                                            <p className="mt-3 text-sm text-[#777] italic">{ing.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection?.layout === 'usage' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <h4 className="font-bold text-[#222] mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">💡</span>
                                        Instructions
                                    </h4>
                                    <p className="text-[#555] whitespace-pre-line">{activeSection.content}</p>
                                </div>
                            </div>
                        )}

                        {activeSection?.layout === 'certifications' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {activeSection.listItems?.map((label, idx) => (
                                    <div key={idx} className="text-center p-4 bg-[#f9f9f9] rounded-lg">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Check className="text-green-600" size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-[#333]">{label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
