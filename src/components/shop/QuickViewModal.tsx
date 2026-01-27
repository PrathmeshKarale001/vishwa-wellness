'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();

    if (!product || !isOpen) return null;

    const inWishlist = isInWishlist(product.id);

    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    const handleAddToCart = () => {
        addItem(product, quantity);
        onClose();
    };

    const handleToggleWishlist = () => {
        toggleItem(product);
    };

    const renderStars = (rating: number = 0) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? 'fill-[#ffa200] text-[#ffa200]' : 'fill-[#ddd] text-[#ddd]'}
            />
        ));
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto relative animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    <div className="grid md:grid-cols-2">
                        {/* Left: Images */}
                        <div className="p-6 bg-[#f9f9f9]">
                            {/* Main Image */}
                            <div className="aspect-square relative mb-4 bg-white">
                                <Image
                                    src={product.images[currentImage]?.src || '/placeholder-product.jpg'}
                                    alt={product.images[currentImage]?.alt || product.title}
                                    fill
                                    className="object-cover"
                                />
                                {product.isNew && (
                                    <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white px-3 py-1 text-xs font-bold uppercase">
                                        New
                                    </span>
                                )}
                                {product.isSale && product.discount && (
                                    <span className="absolute top-3 right-3 bg-[var(--color-accent)] text-white px-3 py-1 text-xs font-bold uppercase">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setCurrentImage(idx)}
                                            className={`flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-colors ${currentImage === idx
                                                ? 'border-[var(--color-primary)]'
                                                : 'border-[#eee] hover:border-[#ddd]'
                                                }`}
                                        >
                                            <Image
                                                src={img.src || '/placeholder-product.jpg'}
                                                alt={img.alt || product.title}
                                                width={64}
                                                height={64}
                                                className="object-cover w-full h-full"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info */}
                        <div className="p-6">
                            {/* Category */}
                            <p className="text-[var(--color-primary)] text-sm font-medium uppercase tracking-wide mb-2">
                                {product.category}
                            </p>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-[#222] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                {product.title}
                            </h2>

                            {/* Rating */}
                            {product.rating !== undefined && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex gap-0.5">{renderStars(product.rating)}</div>
                                    <span className="text-sm text-[#777]">
                                        ({product.reviewCount} reviews)
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-4">
                                {product.discount ? (
                                    <>
                                        <span className="text-2xl font-bold text-[var(--color-primary)]">
                                            ₹{discountedPrice.toLocaleString()}
                                        </span>
                                        <del className="text-lg text-[#999]">
                                            ₹{product.price.toLocaleString()}
                                        </del>
                                        <span className="px-2 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium">
                                            Save {product.discount}%
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Short Description */}
                            <p className="text-[#777] mb-6 line-clamp-3">
                                {product.shortDescription || product.description}
                            </p>

                            {/* Ritual Type Badge */}
                            {product.ritualType && (
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-[#f5f2f2] text-[#777] text-sm uppercase tracking-wide">
                                        {product.ritualType === 'pana' && '🔥 Pāna Ritual'}
                                        {product.ritualType === 'snan' && '💧 Snān Ritual'}
                                        {product.ritualType === 'lepam' && '🤲 Lepam Ritual'}
                                        {product.ritualType === 'home' && '🏠 Home & Aura'}
                                    </span>
                                </div>
                            )}

                            {/* Benefits Preview */}
                            {product.benefits && product.benefits.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-[#222] text-sm uppercase tracking-wide mb-2">
                                        Key Benefits
                                    </h4>
                                    <ul className="space-y-1">
                                        {product.benefits.slice(0, 3).map((benefit, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-[#777]">
                                                <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Quantity & Actions */}
                            <div className="border-t border-[#eee] pt-6">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-[#ddd]">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-12 h-10 text-center border-x border-[#ddd] text-sm focus:outline-none"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        className="btn-solid flex items-center gap-2"
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>

                                    {/* Wishlist */}
                                    <button
                                        onClick={handleToggleWishlist}
                                        className={`w-10 h-10 flex items-center justify-center border transition-colors ${inWishlist
                                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                                            : 'border-[#ddd] text-[#777] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]'
                                            }`}
                                        aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    >
                                        <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
                                    </button>
                                </div>

                                {/* View Full Details */}
                                <Link
                                    href={`/products/${product.slug}`}
                                    onClick={onClose}
                                    className="text-[var(--color-primary)] text-sm font-medium hover:underline"
                                >
                                    View Full Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
