'use client';

import { useState, useEffect } from 'react';
import { Star, User, ThumbsUp, Loader2, CheckCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

interface Review {
    id: string;
    user_id: string;
    rating: number;
    title: string | null;
    content: string | null;
    is_verified: boolean;
    created_at: string;
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    };
}

interface ProductReviewsProps {
    productId: string;
    productRating?: number;
    reviewCount?: number;
}

export default function ProductReviews({ productId, productRating = 0, reviewCount = 0 }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(productRating);
    const [totalReviews, setTotalReviews] = useState(reviewCount);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('reviews')
            .select(`
                id,
                user_id,
                rating,
                title,
                content,
                is_verified,
                created_at,
                profiles (
                    full_name,
                    avatar_url
                )
            `)
            .eq('product_id', productId)
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setReviews(data as Review[]);

            // Calculate average rating
            if (data.length > 0) {
                const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length;
                setAverageRating(Math.round(avg * 10) / 10);
                setTotalReviews(data.length);
            }
        }

        setIsLoading(false);
    };

    const renderStars = (rating: number, size = 16) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={size}
                        className={star <= rating ? 'fill-[#ffa200] text-[#ffa200]' : 'fill-[#ddd] text-[#ddd]'}
                    />
                ))}
            </div>
        );
    };

    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) {
                distribution[r.rating - 1]++;
            }
        });
        return distribution.reverse(); // 5 stars first
    };

    const distribution = getRatingDistribution();

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div>
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-[#222]">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center md:justify-start my-2">
                        {renderStars(Math.round(averageRating), 20)}
                    </div>
                    <p className="text-sm text-[#777]">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                </div>

                {/* Rating Distribution */}
                {totalReviews > 0 && (
                    <div className="flex-1 max-w-sm">
                        {[5, 4, 3, 2, 1].map((stars, idx) => (
                            <div key={stars} className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-[#777] w-12">{stars} star</span>
                                <div className="flex-1 h-2 bg-[#eee] rounded overflow-hidden">
                                    <div
                                        className="h-full bg-[#ffa200] rounded"
                                        style={{ width: totalReviews > 0 ? `${(distribution[idx] / totalReviews) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-sm text-[#777] w-8">{distribution[idx]}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-8 bg-[#f9f9f9] rounded">
                    <Star className="w-12 h-12 text-[#ddd] mx-auto mb-4" />
                    <p className="text-[#777]">No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-[#eee] pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {review.profiles?.avatar_url ? (
                                        <img
                                            src={review.profiles.avatar_url}
                                            alt=""
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                                            <User size={20} className="text-[#999]" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-medium text-[#222]">
                                            {review.profiles?.full_name || 'Anonymous'}
                                        </span>
                                        {review.is_verified && (
                                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                <CheckCircle size={12} />
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 mb-2">
                                        {renderStars(review.rating, 14)}
                                        <span className="text-xs text-[#999]">
                                            {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    {review.title && (
                                        <h4 className="font-medium text-[#222] mb-1">{review.title}</h4>
                                    )}

                                    {review.content && (
                                        <p className="text-[#777] text-sm leading-relaxed">{review.content}</p>
                                    )}

                                    {/* Helpful Button */}
                                    <button className="flex items-center gap-1 mt-3 text-xs text-[#999] hover:text-[var(--color-primary)] transition-colors">
                                        <ThumbsUp size={14} />
                                        Helpful
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
