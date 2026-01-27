interface RatingDistributionProps {
    ratings: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    totalReviews: number;
}

export default function RatingDistribution({ ratings, totalReviews }: RatingDistributionProps) {
    const getPercentage = (count: number) => {
        if (totalReviews === 0) return 0;
        return Math.round((count / totalReviews) * 100);
    };

    const ratingColors: Record<number, string> = {
        5: 'bg-green-500',
        4: 'bg-lime-500',
        3: 'bg-yellow-500',
        2: 'bg-orange-500',
        1: 'bg-red-500',
    };

    return (
        <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings[star as keyof typeof ratings] || 0;
                const percentage = getPercentage(count);

                return (
                    <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 w-12">
                            {star} ⭐
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${ratingColors[star]} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                            {count}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
