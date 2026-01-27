import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0-5, can be decimal like 4.7
    size?: 'sm' | 'md' | 'lg';
    showNumber?: boolean;
    reviewCount?: number;
}

export default function StarRating({ rating, size = 'md', showNumber = false, reviewCount }: StarRatingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const textClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const iconSize = sizeClasses[size];
    const textSize = textClasses[size];

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                // Full star
                stars.push(
                    <Star
                        key={i}
                        className={`${iconSize} fill-[#FFA500] text-[#FFA500]`}
                    />
                );
            } else if (i === fullStars && hasHalfStar) {
                // Half star
                stars.push(
                    <div key={i} className="relative">
                        <Star className={`${iconSize} text-gray-300`} />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star className={`${iconSize} fill-[#FFA500] text-[#FFA500]`} />
                        </div>
                    </div>
                );
            } else {
                // Empty star
                stars.push(
                    <Star
                        key={i}
                        className={`${iconSize} text-gray-300`}
                    />
                );
            }
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {renderStars()}
            </div>
            {showNumber && (
                <div className="flex items-center gap-1">
                    <span className={`${textSize} font-semibold text-gray-900`}>
                        {rating.toFixed(1)}
                    </span>
                    {reviewCount !== undefined && (
                        <span className={`${textSize} text-gray-500`}>
                            ({reviewCount.toLocaleString()})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
