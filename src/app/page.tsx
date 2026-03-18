import { fetchProducts, fetchHeroSlides } from '@/lib/sanity.fetch';
import { sanityProductsToFrontend } from '@/lib/sanity.utils';
import { Product } from '@/types';
import HomePageClient from './HomePageClient';
import { fetchLatestYouTubeVideos, YouTubeVideo } from '@/lib/youtube';

export default async function HomePage() {
  // Fetch products, hero slides, and latest YouTube videos in parallel
  const [sanityProducts, sanityHeroSlides, latestVideos] = await Promise.all([
    fetchProducts(),
    fetchHeroSlides(),
    fetchLatestYouTubeVideos(3),
  ]);

  // Convert to frontend format
  const products = sanityProductsToFrontend(sanityProducts);

  // Get featured products (first 4, or all new/sale items)
  const featuredProducts = products
    .filter((p: Product) => p.isNew || p.isSale || (p as any).isBestSeller)
    .slice(0, 4);

  // If no featured products, just show first 4
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <HomePageClient
      featuredProducts={displayProducts}
      heroSlides={sanityHeroSlides}
      latestVideos={latestVideos}
    />
  );
}
