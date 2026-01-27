'use client';

import { useState } from 'react';
import StarRating from '@/components/product/StarRating';
import { User, CheckCircle } from 'lucide-react';

export interface Review {
    id: string;
    user_name: string;
    rating: number;
    title?: string;
    review_text: string;
    verified_purchase: boolean;
    created_at: string;
}

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;
    const shouldTruncate = review.review_text.length > maxLength;
    const displayText = isExpanded || !shouldTruncate
        ? review.review_text
        : review.review_text.substring(0, maxLength) + '...';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="border-b border-gray-200 pb-6 last:border-0">
            {/* Header */}
            <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                        {review.verified_purchase && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                <CheckCircle className="w-3 h-3" />
                                Verified Purchase
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-gray-500">
                            {formatDate(review.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Review Content */}
            <div className="ml-14">
                {review.title && (
                    <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                )}
                <p className="text-gray-700 leading-relaxed mb-2">
                    {displayText}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-[var(--color-primary)] hover:underline font-medium"
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>
        </div>
    );
}
