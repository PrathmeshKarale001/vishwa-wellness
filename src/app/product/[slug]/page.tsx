import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductDetail } from '@/lib/sanity.fetch';
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
        description: product.metaDescription || product.detailedDescription?.shortHeadline || product.description,
        openGraph: {
            title: product.title,
            description: product.detailedDescription?.shortHeadline || product.description,
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

    return <ProductDetailClient product={product} />;
}
