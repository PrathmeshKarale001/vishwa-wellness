'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import { useQuickViewStore } from '@/lib/quickViewStore';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onAddToWishlist?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
}

export default function ProductCard({
    product,
    onAddToCart,
    onAddToWishlist,
    onQuickView
}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [mounted, setMounted] = useState(false);
    const { addItem } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const { openQuickView } = useQuickViewStore();

    const inWishlist = mounted ? isInWishlist(product.id) : false;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
        onAddToCart?.(product);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
        onAddToWishlist?.(product);
    };

    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    const renderStars = (rating: number = 0) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={12}
                className={i < Math.floor(rating) ? 'fill-[#ffa200] text-[#ffa200]' : 'fill-[#ddd] text-[#ddd]'}
            />
        ));
    };

    return (
        <div
            className="product-box group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImage(0);
            }}
        >
            {/* Image Wrapper */}
            <div className="img-wrapper relative overflow-hidden bg-[#f9f9f9]">
                {/* Labels */}
                {product.isNew && (
                    <span className="label-new">New</span>
                )}
                {product.isSale && product.discount && (
                    <span className="label-sale">-{product.discount}%</span>
                )}

                {/* Main Image */}
                <Link href={`/product/${product.slug}`} className="block aspect-square relative">
                    <Image
                        src={product.images[currentImage]?.src || '/placeholder-product.jpg'}
                        alt={product.images[currentImage]?.alt || product.title}
                        fill
                        className={`object-cover transition-opacity duration-300 ${isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
                            }`}
                    />
                    {/* Hover Image */}
                    {product.images.length > 1 && (
                        <Image
                            src={product.images[1].src}
                            alt={product.images[1].alt || product.title}
                            fill
                            className={`object-cover transition-opacity duration-300 absolute inset-0 ${isHovered ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    )}
                </Link>

                {/* Hover Action Icons */}
                <div className="cart-wrap">
                    <button
                        onClick={handleAddToCart}
                        title="Add to Cart"
                        aria-label="Add to Cart"
                    >
                        <ShoppingCart size={16} />
                    </button>
                    <button
                        onClick={handleToggleWishlist}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        className={inWishlist ? '!bg-[var(--color-primary)] !text-white !border-[var(--color-primary)]' : ''}
                    >
                        <Heart size={16} className={inWishlist ? 'fill-current' : ''} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openQuickView(product);
                            onQuickView?.(product);
                        }}
                        title="Quick View"
                        aria-label="Quick View"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                {/* Image Thumbnails (on hover) */}
                {product.images.length > 1 && isHovered && (
                    <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-2 px-4">
                        {product.images.slice(0, 4).map((img, idx) => (
                            <button
                                key={img.id}
                                className={`w-10 h-10 border-2 overflow-hidden transition-all ${currentImage === idx ? 'border-[var(--color-primary)]' : 'border-white'
                                    }`}
                                onMouseEnter={() => setCurrentImage(idx)}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="product-detail">
                {/* Rating */}
                {product.rating !== undefined && (
                    <div className="rating">
                        {renderStars(product.rating)}
                        {product.reviewCount && (
                            <span className="text-xs text-[#999] ml-1">({product.reviewCount})</span>
                        )}
                    </div>
                )}

                {/* Category */}
                <h6>{product.category}</h6>

                {/* Title */}
                <Link href={`/product/${product.slug}`}>
                    <h4 className="hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {product.title}
                    </h4>
                </Link>

                {/* Price */}
                <div className="price">
                    {product.discount ? (
                        <>
                            <del>₹{product.price.toLocaleString()}</del>
                            <span>₹{discountedPrice.toLocaleString()}</span>
                        </>
                    ) : (
                        <span>₹{product.price.toLocaleString()}</span>
                    )}
                </div>

                {/* Ritual Type Badge */}
                {product.ritualType && (
                    <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs bg-[#f5f2f2] text-[#777] uppercase tracking-wide">
                            {product.ritualType === 'snan' && 'Snān Ritual'}
                            {product.ritualType === 'lepam' && 'Lepam Ritual'}
                            {product.ritualType === 'pana' && 'Pāna Ritual'}
                            {product.ritualType === 'home' && 'Home & Aura'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
