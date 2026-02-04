'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OptimizedLink from '@/components/ui/optimized-link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import { useQuickViewStore } from '@/lib/quickViewStore';
import { getImageUrl, getImageAlt } from '@/lib/image-utils';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onAddToWishlist?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
}

function ProductCard({
    product,
    onAddToCart,
    onAddToWishlist,
    onQuickView
}: ProductCardProps) {
    const router = useRouter();
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

    // product.price is already the sale/discounted price from Sanity
    // comparePrice is the original price (shown as strikethrough)
    const displayPrice = product.price;

    const renderStars = (rating: number = 0) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={12}
                className={i < Math.floor(rating) ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'fill-[var(--color-border)] text-[var(--color-border)]'}
            />
        ));
    };

    return (
        <div
            className="product-box group"
            onMouseEnter={() => {
                setIsHovered(true);
                if (product.images.length > 1 && currentImage === 0) {
                    setCurrentImage(1);
                }
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImage(0);
            }}
        >
            {/* Image Wrapper */}
            <div className="img-wrapper relative overflow-hidden bg-[var(--color-bg-light)] image-zoom">
                {/* Labels */}
                {product.isNew && (
                    <span className="label-new">New</span>
                )}
                {product.isSale && product.discount && (
                    <span className="label-sale">-{product.discount}%</span>
                )}

                {/* Main Image */}
                <OptimizedLink
                    href={`/products/${product.slug}`}
                    className="block aspect-square relative"
                    prefetchOnHover={true}
                    prefetchOnVisible={true}
                    prefetchPriority="high"
                >
                    {product.images.slice(0, 4).map((img, idx) => (
                        <Image
                            key={(img as any)._key || img.id || idx}
                            src={getImageUrl(img)}
                            alt={getImageAlt(img, product.title)}
                            fill
                            className={`object-cover transition-all duration-500 ease-out absolute inset-0 ${currentImage === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                }`}
                            priority={idx === 0}
                        />
                    ))}
                </OptimizedLink>

                {/* Hover Action Icons */}
                <div className="cart-wrap">
                    <button
                        onClick={handleAddToCart}
                        title="Add to Cart"
                        aria-label="Add to Cart"
                        className="hover-scale"
                    >
                        <ShoppingCart size={16} />
                    </button>
                    <button
                        onClick={handleToggleWishlist}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        className={`hover-scale ${inWishlist ? '!bg-[var(--color-primary)] !text-white !border-[var(--color-primary)]' : ''}`}
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
                        className="hover-scale"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                {/* Image Thumbnails (on hover) - Vertical layout on left */}
                {product.images.length > 1 && isHovered && (
                    <div className="absolute top-14 left-3 flex flex-col gap-2 z-10 animate-fadeIn">
                        {product.images.slice(0, 4).map((img, idx) => (
                            <button
                                key={(img as any)._key || img.id || idx}
                                className={`w-10 h-10 border-2 overflow-hidden transition-all bg-white shadow-sm rounded-sm ${currentImage === idx ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'border-transparent hover:border-gray-300'
                                    }`}
                                onMouseEnter={(e) => {
                                    e.stopPropagation();
                                    setCurrentImage(idx);
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push(`/products/${product.slug}`);
                                }}
                            >
                                <Image
                                    src={getImageUrl(img)}
                                    alt={getImageAlt(img)}
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
                            <span className="text-[10px] text-[var(--color-light-text)] ml-1">({product.reviewCount})</span>
                        )}
                    </div>
                )}

                {/* Category */}
                <h6 className="!text-[var(--color-primary)] !font-bold !text-[10px] !uppercase !tracking-widest !mb-2">
                    {product.category}
                </h6>

                {/* Title */}
                <Link href={`/products/${product.slug}`}>
                    <h4 className="hover:text-[var(--color-primary)] transition-colors line-clamp-1 !text-sm !font-bold !mb-2">
                        {product.title}
                    </h4>
                </Link>

                {/* Price */}
                <div className="price flex items-center justify-center gap-2">
                    {product.comparePrice ? (
                        <>
                            <del className="!text-[var(--color-light-text)] !font-normal !text-xs italic">₹{Math.round(product.comparePrice).toLocaleString('en-IN')}</del>
                            <span className="!text-black !font-bold">₹{Math.round(displayPrice).toLocaleString('en-IN')}</span>
                        </>
                    ) : (
                        <span className="!text-black !font-bold">₹{Math.round(displayPrice).toLocaleString('en-IN')}</span>
                    )}
                </div>

                {/* Ritual Type Badge */}
                {product.ritualType && (
                    <div className="mt-3">
                        <span className="inline-block px-3 py-1 text-[10px] bg-[var(--color-bg-cream)] text-[var(--color-muted)] uppercase tracking-[0.15em] font-medium rounded-full">
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

// Memoize the component to prevent unnecessary re-renders
// Only re-renders when product data changes
export default memo(ProductCard, (prevProps, nextProps) => {
    return (
        prevProps.product.id === nextProps.product.id &&
        prevProps.product.price === nextProps.product.price &&
        prevProps.product.stock === nextProps.product.stock &&
        prevProps.product.isSale === nextProps.product.isSale &&
        prevProps.product.isNew === nextProps.product.isNew
    );
});
