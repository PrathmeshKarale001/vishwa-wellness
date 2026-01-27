import { notFound } from 'next/navigation';
import { fetchProductDetail } from '@/lib/sanity.fetch';
import { sanityProductToFrontend } from '@/lib/sanity.utils';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const sanityProduct = await fetchProductDetail(slug);

    if (!sanityProduct) {
        return {
            title: 'Product Not Found',
        };
    }

    const product = sanityProductToFrontend(sanityProduct);
    const image = product.images[0]?.url || product.images[0]?.src;

    return {
        title: `${product.title} | Vishwa Wellness`,
        description: product.shortDescription || product.description,
        openGraph: {
            title: product.title,
            description: product.shortDescription || product.description,
            images: image ? [{ url: image }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.shortDescription || product.description,
            images: image ? [image] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const sanityProduct = await fetchProductDetail(slug);

    if (!sanityProduct) {
        notFound();
    }

    const product = sanityProductToFrontend(sanityProduct);

    return <ProductDetailClient product={product} />;
}
