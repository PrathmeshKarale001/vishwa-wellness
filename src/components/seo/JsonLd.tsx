import Script from 'next/script';

interface OrganizationSchemaProps {
    name: string;
    url: string;
    logo: string;
    description: string;
    sameAs?: string[];
}

export function OrganizationSchema({
    name,
    url,
    logo,
    description,
    sameAs = [],
}: OrganizationSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        logo,
        description,
        sameAs,
    };

    return (
        <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface ProductSchemaProps {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    rating?: number;
    reviewCount?: number;
    sku?: string;
}

export function ProductSchema({
    name,
    description,
    image,
    price,
    currency = 'INR',
    availability = 'InStock',
    rating,
    reviewCount,
    sku,
}: ProductSchemaProps) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image,
        sku,
        offers: {
            '@type': 'Offer',
            price: price.toString(),
            priceCurrency: currency,
            availability: `https://schema.org/${availability}`,
        },
    };

    if (rating && reviewCount) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: rating.toString(),
            reviewCount: reviewCount.toString(),
        };
    }

    return (
        <Script
            id={`product-schema-${sku || name}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
