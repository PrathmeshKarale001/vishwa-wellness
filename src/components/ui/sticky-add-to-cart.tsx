"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Plus, Minus, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface Product {
    name: string;
    price: number;
    comparePrice?: number;
    image?: string;
    inStock?: boolean;
}

interface StickyAddToCartProps {
    product: Product;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onWishlist?: () => void;
    isInWishlist?: boolean;
    isLoading?: boolean;
    className?: string;
}

/**
 * Sticky Add to Cart Bar
 * Shows at the bottom of the screen on mobile when the main CTA is out of view
 */
export function StickyAddToCart({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    onWishlist,
    isInWishlist = false,
    isLoading = false,
    className,
}: StickyAddToCartProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky bar when scrolled past 600px (after main CTA is out of view)
            const scrollY = window.scrollY;
            setIsVisible(scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
                        "bg-white/95 backdrop-blur-lg border-t border-stone-200",
                        "safe-bottom", // For iOS safe area
                        className
                    )}
                >
                    <div className="px-4 py-3">
                        {/* Product summary */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {product.image && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-stone-900 line-clamp-1">
                                        {product.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-stone-900">
                                            ₹{Math.round(product.price).toLocaleString()}
                                        </span>
                                        {product.comparePrice && (
                                            <>
                                                <span className="text-sm text-stone-400 line-through">
                                                    ₹{Math.round(product.comparePrice).toLocaleString()}
                                                </span>
                                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                                    {discount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Quantity selector */}
                            <div className="flex items-center bg-stone-100 rounded-lg">
                                <button
                                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => onQuantityChange(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Wishlist button */}
                            {onWishlist && (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onWishlist}
                                    className={cn(
                                        "w-10 h-10 flex items-center justify-center rounded-lg border",
                                        isInWishlist
                                            ? "bg-red-50 border-red-200 text-red-600"
                                            : "bg-white border-stone-200 text-stone-600"
                                    )}
                                >
                                    <Heart
                                        className={cn("w-5 h-5", isInWishlist && "fill-current")}
                                    />
                                </motion.button>
                            )}

                            {/* Add to cart button */}
                            <Button
                                variant="primary"
                                size="lg"
                                className="flex-1"
                                onClick={onAddToCart}
                                loading={isLoading}
                                disabled={!product.inStock}
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {product.inStock !== false ? "Add to Cart" : "Out of Stock"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
