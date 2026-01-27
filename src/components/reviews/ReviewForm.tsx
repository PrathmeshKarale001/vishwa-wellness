'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface ReviewFormProps {
    productId: string;
    onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (reviewText.trim().length < 10) {
            setError('Review must be at least 10 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('You must be logged in to submit a review');
                setIsSubmitting(false);
                return;
            }

            const { error: submitError } = await supabase
                .from('product_reviews')
                .insert({
                    product_id: productId,
                    user_id: user.id,
                    user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
                    user_email: user.email,
                    rating,
                    title: title.trim() || null,
                    review_text: reviewText.trim(),
                    verified_purchase: false, // TODO: Check if user actually purchased
                });

            if (submitError) throw submitError;

            // Reset form
            setRating(0);
            setTitle('');
            setReviewText('');
            onSuccess?.();
        } catch (err) {
            console.error('Review submission error:', err);
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Rating Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating *
                </label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                        ? 'fill-[#FFA500] text-[#FFA500]'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                            {rating} out of 5 stars
                        </span>
                    )}
                </div>
            </div>

            {/* Title */}
            <div>
                <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title (Optional)
                </label>
                <input
                    type="text"
                    id="review-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Great product, highly recommend!"
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
            </div>

            {/* Review Text */}
            <div>
                <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                </label>
                <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={5}
                    maxLength={1000}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                />
                <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Minimum 10 characters</span>
                    <span className="text-xs text-gray-500">{reviewText.length}/1000</span>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-solid py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
