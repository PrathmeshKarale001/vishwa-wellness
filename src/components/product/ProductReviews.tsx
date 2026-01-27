'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { Star, ThumbsUp, User, ChevronDown, ChevronUp, Verified } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/authStore';

// Types
export interface Review {
    id: string;
    user_id: string;
    product_id: string;
    rating: number;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    verified_purchase: boolean;
    helpful_count: number;
    images?: string[];
    created_at: string;
    user_name?: string;
    user_avatar?: string;
}

interface ReviewsProps {
    productId: string;
    productName: string;
}

interface ReviewFormData {
    rating: number;
    title: string;
    content: string;
    pros: string;
    cons: string;
}

// Star Rating Component
const StarRating = memo(function StarRating({
    rating,
    size = 16,
    interactive = false,
    onRatingChange,
}: {
    rating: number;
    size?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}) {
    const [hoverRating, setHoverRating] = useState(0);
    const displayRating = hoverRating || rating;

    return (
        <div className="flex gap-0.5" role={interactive ? 'radiogroup' : 'img'} aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type={interactive ? 'button' : undefined}
                    disabled={!interactive}
                    className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    onClick={() => interactive && onRatingChange?.(star)}
                    aria-label={interactive ? `Rate ${star} stars` : undefined}
                >
                    <Star
                        size={size}
                        className={
                            star <= displayRating
                                ? 'fill-[var(--color-warning)] text-[var(--color-warning)]'
                                : 'fill-gray-200 text-gray-200'
                        }
                    />
                </button>
            ))}
        </div>
    );
});

// Rating Summary Component
const RatingSummary = memo(function RatingSummary({
    reviews,
    averageRating,
}: {
    reviews: Review[];
    averageRating: number;
}) {
    const totalReviews = reviews.length;
    const ratingCounts = [5, 4, 3, 2, 1].map(
        (rating) => reviews.filter((r) => Math.floor(r.rating) === rating).length
    );

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 bg-[var(--color-bg-light)] rounded-lg">
            {/* Average Rating */}
            <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-[var(--color-dark)]">
                    {averageRating.toFixed(1)}
                </div>
                <StarRating rating={averageRating} size={20} />
                <p className="text-sm text-[var(--color-muted)] mt-2">
                    Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating, index) => {
                    const count = ratingCounts[index];
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    return (
                        <div key={rating} className="flex items-center gap-3 text-sm">
                            <span className="w-8 text-[var(--color-muted)]">{rating}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--color-warning)] transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="w-8 text-[var(--color-muted)]">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

// Single Review Card
const ReviewCard = memo(function ReviewCard({
    review,
    onHelpful,
}: {
    review: Review;
    onHelpful: (reviewId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const isLongContent = review.content.length > 300;

    return (
        <article className="border-b border-[var(--color-border)] py-6 last:border-b-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[var(--color-bg-light)] flex items-center justify-center overflow-hidden">
                        {review.user_avatar ? (
                            <Image
                                src={review.user_avatar}
                                alt={review.user_name || 'User'}
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        ) : (
                            <User size={20} className="text-[var(--color-muted)]" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--color-dark)]">
                                {review.user_name || 'Anonymous'}
                            </span>
                            {review.verified_purchase && (
                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    <Verified size={12} />
                                    Verified Purchase
                                </span>
                            )}
                        </div>
                        <time className="text-xs text-[var(--color-muted)]">
                            {new Date(review.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </time>
                    </div>
                </div>
                <StarRating rating={review.rating} size={14} />
            </div>

            {/* Title */}
            {review.title && (
                <h4 className="font-semibold text-[var(--color-dark)] mb-2">{review.title}</h4>
            )}

            {/* Content */}
            <div className={`text-[var(--color-muted)] ${!expanded && isLongContent ? 'line-clamp-3' : ''}`}>
                {review.content}
            </div>
            {isLongContent && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-[var(--color-primary)] flex items-center gap-1 mt-2 hover:underline"
                >
                    {expanded ? (
                        <>
                            Show less <ChevronUp size={14} />
                        </>
                    ) : (
                        <>
                            Read more <ChevronDown size={14} />
                        </>
                    )}
                </button>
            )}

            {/* Pros & Cons */}
            {(review.pros?.length || review.cons?.length) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {review.pros && review.pros.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold text-green-600 uppercase mb-1">Pros</h5>
                            <ul className="text-sm text-[var(--color-muted)] space-y-1">
                                {review.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                        <span className="text-green-500">+</span> {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {review.cons && review.cons.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold text-red-600 uppercase mb-1">Cons</h5>
                            <ul className="text-sm text-[var(--color-muted)] space-y-1">
                                {review.cons.map((con, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                        <span className="text-red-500">−</span> {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Helpful Button */}
            <div className="mt-4 flex items-center gap-4">
                <button
                    onClick={() => onHelpful(review.id)}
                    className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <ThumbsUp size={14} />
                    Helpful ({review.helpful_count || 0})
                </button>
            </div>
        </article>
    );
});

// Review Form Component
function ReviewForm({
    productId,
    onSubmit,
    onCancel,
}: {
    productId: string;
    onSubmit: (data: ReviewFormData) => Promise<void>;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<ReviewFormData>({
        rating: 0,
        title: '',
        content: '',
        pros: '',
        cons: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!formData.content.trim()) {
            setError('Please write your review');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[var(--color-bg-light)] rounded-lg">
            <h3 className="text-lg font-semibold text-[var(--color-dark)]">Write a Review</h3>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
            )}

            {/* Rating */}
            <div>
                <label className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                    Your Rating *
                </label>
                <StarRating
                    rating={formData.rating}
                    size={28}
                    interactive
                    onRatingChange={(rating) => setFormData({ ...formData, rating })}
                />
            </div>

            {/* Title */}
            <div>
                <label htmlFor="review-title" className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                    Review Title
                </label>
                <input
                    id="review-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Sum up your review in a few words"
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                />
            </div>

            {/* Content */}
            <div>
                <label htmlFor="review-content" className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                    Your Review *
                </label>
                <textarea
                    id="review-content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="What did you like or dislike about this product?"
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="review-pros" className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                        Pros (comma separated)
                    </label>
                    <input
                        id="review-pros"
                        type="text"
                        value={formData.pros}
                        onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                        placeholder="Great quality, Fast shipping"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                </div>
                <div>
                    <label htmlFor="review-cons" className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                        Cons (comma separated)
                    </label>
                    <input
                        id="review-cons"
                        type="text"
                        value={formData.cons}
                        onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                        placeholder="Could be cheaper"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-solid disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" onClick={onCancel} className="btn-outline">
                    Cancel
                </button>
            </div>
        </form>
    );
}

// Main Reviews Component
export default function ProductReviews({ productId, productName }: ReviewsProps) {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase
                .from('product_reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setReviews(data);
            }
            setLoading(false);
        };

        fetchReviews();
    }, [productId]);

    // Submit review handler
    const handleSubmitReview = async (formData: ReviewFormData) => {
        if (!user) return;

        const supabase = getSupabaseClient();
        const { data, error } = await supabase.from('product_reviews').insert({
            product_id: productId,
            user_id: user.id,
            rating: formData.rating,
            title: formData.title,
            content: formData.content,
            pros: formData.pros ? formData.pros.split(',').map(s => s.trim()).filter(Boolean) : [],
            cons: formData.cons ? formData.cons.split(',').map(s => s.trim()).filter(Boolean) : [],
            user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            verified_purchase: false, // Would check order history in production
        }).select().single();

        if (!error && data) {
            setReviews([data, ...reviews]);
            setShowForm(false);
        }
    };

    // Mark review as helpful
    const handleHelpful = async (reviewId: string) => {
        const supabase = getSupabaseClient();
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;

        await supabase
            .from('product_reviews')
            .update({ helpful_count: (review.helpful_count || 0) + 1 })
            .eq('id', reviewId);

        setReviews(reviews.map(r =>
            r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r
        ));
    };

    // Sort reviews
    const sortedReviews = [...reviews].sort((a, b) => {
        switch (sortBy) {
            case 'helpful':
                return (b.helpful_count || 0) - (a.helpful_count || 0);
            case 'rating':
                return b.rating - a.rating;
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    if (loading) {
        return (
            <div className="py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-32 bg-gray-200 rounded" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-8" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="text-2xl font-bold text-[var(--color-dark)] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Customer Reviews
            </h2>

            {/* Rating Summary */}
            {reviews.length > 0 && (
                <RatingSummary reviews={reviews} averageRating={averageRating} />
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--color-muted)]">
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="text-sm border border-[var(--color-border)] rounded px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)]"
                        aria-label="Sort reviews"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="helpful">Most Helpful</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
                {user && !showForm && (
                    <button onClick={() => setShowForm(true)} className="btn-solid">
                        Write a Review
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showForm && user && (
                <div className="mb-8">
                    <ReviewForm
                        productId={productId}
                        onSubmit={handleSubmitReview}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Login prompt for non-authenticated users */}
            {!user && (
                <div className="p-4 bg-[var(--color-bg-light)] rounded-lg text-center mb-6">
                    <p className="text-[var(--color-muted)]">
                        <a href="/account/login" className="text-[var(--color-primary)] hover:underline">
                            Sign in
                        </a>
                        {' '}to write a review
                    </p>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className="divide-y divide-[var(--color-border)]">
                    {sortedReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-[var(--color-muted)] mb-4">
                        No reviews yet. Be the first to review {productName}!
                    </p>
                    {user && (
                        <button onClick={() => setShowForm(true)} className="btn-outline">
                            Write the First Review
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
