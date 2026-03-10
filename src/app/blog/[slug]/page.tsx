import { fetchPostBySlug, fetchAllPostSlugs } from '@/lib/sanity.fetch';
import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await fetchAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await fetchPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}
