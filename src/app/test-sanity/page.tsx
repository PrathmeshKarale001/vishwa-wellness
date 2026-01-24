import { isSanityConfigured } from '@/lib/sanity';
import { fetchHeroSlides, fetchProducts } from '@/lib/sanity.fetch';

export default async function TestSanityPage() {
    const configured = isSanityConfigured();

    let products: any[] = [];
    let heroSlides: any[] = [];
    let error: string | null = null;

    if (configured) {
        try {
            products = await fetchProducts();
            heroSlides = await fetchHeroSlides();
        } catch (e: any) {
            error = e.message;
        }
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Sanity CMS Connection Test</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Configuration Status</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-semibold">Configured:</span>{' '}
                            <span className={configured ? 'text-green-600' : 'text-red-600'}>
                                {configured ? '✓ Yes' : '✗ No'}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold">Project ID:</span>{' '}
                            {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'Not set'}
                        </p>
                        <p>
                            <span className="font-semibold">Dataset:</span>{' '}
                            {process.env.NEXT_PUBLIC_SANITY_DATASET || 'Not set'}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Hero Slides</h2>
                    <p className="text-gray-600 mb-4">Found: {heroSlides.length} slides</p>
                    {heroSlides.length > 0 ? (
                        <ul className="space-y-2">
                            {heroSlides.map((slide: any) => (
                                <li key={slide._id} className="border-l-4 border-blue-500 pl-4">
                                    <p className="font-semibold">{slide.title}</p>
                                    <p className="text-sm text-gray-600">{slide.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">
                            No hero slides found. Add some in Sanity Studio!
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Products</h2>
                    <p className="text-gray-600 mb-4">Found: {products.length} products</p>
                    {products.length > 0 ? (
                        <ul className="space-y-2">
                            {products.map((product: any) => (
                                <li key={product._id} className="border-l-4 border-green-500 pl-4">
                                    <p className="font-semibold">{product.title}</p>
                                    <p className="text-sm text-gray-600">₹{product.price}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">
                            No products found. Add some in Sanity Studio!
                        </p>
                    )}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Next Steps:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Navigate to your Sanity Studio</li>
                        <li>Create your first product or hero slide</li>
                        <li>Refresh this page to see your content!</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
