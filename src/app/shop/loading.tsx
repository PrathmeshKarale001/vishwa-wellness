import { ProductCardSkeleton, FilterSkeleton, BreadcrumbSkeleton } from '@/components/ui/skeleton';

export default function ShopLoading() {
    return (
        <>
            {/* Breadcrumb Skeleton */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <BreadcrumbSkeleton />
                </div>
            </div>

            {/* Page Header Skeleton */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="h-10 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
            </div>

            {/* Main Content */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-1">
                            <FilterSkeleton />
                        </div>

                        {/* Products Grid Skeleton */}
                        <div className="lg:col-span-3">
                            {/* Toolbar Skeleton */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                            </div>

                            {/* Product Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
