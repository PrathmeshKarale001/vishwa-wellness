import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductDetail, fetchRelatedProducts } from '@/lib/sanity.fetch';
import ProductDetailClient from '@/components/product/ProductDetailClient';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await fetchProductDetail(slug);

    if (!product) {
        return {
            title: 'Product Not Found | Vishwa Wellness',
        };
    }

    return {
        title: product.metaTitle || `${product.title} | Vishwa Wellness`,
        description: product.metaDescription || product.benefitHeadline || product.description,
        openGraph: {
            title: product.title,
            description: product.benefitHeadline || product.description,
            images: product.images?.[0]?.url ? [product.images[0].url] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await fetchProductDetail(slug);

    if (!product) {
        notFound();
    }

    // Fetch related products from the same category
    let relatedProducts: any[] = [];
    if (product.category?.slug) {
        relatedProducts = await fetchRelatedProducts(product.category.slug, product._id);
    }

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
