'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

/**
 * Breadcrumb navigation component with structured data support
 * Improves navigation and SEO
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    // Generate JSON-LD structured data for breadcrumbs
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com'}${item.href}` : undefined,
        })),
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* Breadcrumb Navigation */}
            <nav
                aria-label="Breadcrumb"
                className={`py-4 ${className}`}
            >
                <ol className="flex items-center gap-2 text-sm text-[var(--color-muted)] flex-wrap">
                    {/* Home Link */}
                    <li className="flex items-center">
                        <Link
                            href="/"
                            className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                            aria-label="Home"
                        >
                            <Home size={14} />
                            <span className="sr-only sm:not-sr-only">Home</span>
                        </Link>
                    </li>

                    {items.map((item, index) => (
                        <li key={index} className="flex items-center">
                            <ChevronRight size={14} className="mx-1 text-[var(--color-border)]" aria-hidden="true" />
                            {item.href && index < items.length - 1 ? (
                                <Link
                                    href={item.href}
                                    className="hover:text-[var(--color-primary)] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className="text-[var(--color-dark)] font-medium"
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}

/**
 * Pre-built breadcrumb configurations for common pages
 */
export const BreadcrumbConfigs = {
    shop: [{ label: 'Shop', href: '/shop' }],

    product: (productName: string, categoryName?: string, categorySlug?: string) => {
        const items: BreadcrumbItem[] = [{ label: 'Shop', href: '/shop' }];
        if (categoryName && categorySlug) {
            items.push({ label: categoryName, href: `/shop?category=${categorySlug}` });
        }
        items.push({ label: productName });
        return items;
    },

    category: (categoryName: string) => [
        { label: 'Shop', href: '/shop' },
        { label: categoryName },
    ],

    cart: [{ label: 'Cart' }],

    checkout: [
        { label: 'Cart', href: '/cart' },
        { label: 'Checkout' },
    ],

    account: (pageName: string) => [
        { label: 'Account', href: '/account' },
        { label: pageName },
    ],

    staticPage: (pageName: string) => [{ label: pageName }],
};
