"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

/**
 * Skeleton loading component with shimmer animation
 * Used for content placeholders while loading
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
                className
            )}
        />
    );
}

/**
 * Product Card Skeleton
 */
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
            </div>
        </div>
    );
}

/**
 * Product Grid Skeleton
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Product Detail Skeleton
 */
export function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                <Skeleton className="h-10 w-32" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
}

/**
 * Order Card Skeleton
 */
export function OrderCardSkeleton() {
    return (
        <div className="border rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-4">
                {[1, 2].map((i) => (
                    <Skeleton key={i} className="w-16 h-16 rounded-lg" />
                ))}
            </div>
            <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
            </div>
        </div>
    );
}

/**
 * Text Line Skeleton
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === lines - 1 ? "w-3/4" : "w-full"
                    )}
                />
            ))}
        </div>
    );
}

/**
 * Avatar Skeleton
 */
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    return <Skeleton className={cn("rounded-full", sizeClasses[size])} />;
}

/**
 * Button Skeleton
 */
export function ButtonSkeleton({
    size = "md",
    fullWidth = false
}: {
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}) {
    const sizeClasses = {
        sm: "h-8 w-20",
        md: "h-10 w-28",
        lg: "h-12 w-36",
    };

    return (
        <Skeleton
            className={cn(
                "rounded-lg",
                fullWidth ? "w-full h-12" : sizeClasses[size]
            )}
        />
    );
}
