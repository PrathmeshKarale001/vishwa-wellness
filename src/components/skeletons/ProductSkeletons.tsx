export function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            {/* Breadcrumbs Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-xl"></div>
                        <div className="flex gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="space-y-6">
                        <div>
                            <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                        </div>

                        <div className="border-t border-b border-gray-200 py-4">
                            <div className="h-12 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>

                        <div className="h-6 bg-gray-200 rounded w-40"></div>

                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-12 bg-gray-200 rounded w-32"></div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 h-14 bg-gray-200 rounded-lg"></div>
                            <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                            <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="mt-16">
                    <div className="flex gap-4 border-b border-gray-200 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-10 w-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg p-8 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-6 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    );
}

export function ReviewsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Overall Rating */}
            <div className="flex items-center gap-8 pb-6 border-b">
                <div>
                    <div className="h-16 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex-1 space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                            <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-8"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Individual Reviews */}
            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3 pb-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
