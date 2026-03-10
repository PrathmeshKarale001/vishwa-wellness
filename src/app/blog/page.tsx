import { fetchPosts } from '@/lib/sanity.fetch';
import BlogClient from './BlogClient';

export const metadata = {
    title: 'Blog | Vishwa Wellness',
    description: 'Explore ancient wisdom, modern science, and the transformative power of Agnihotra wellness.',
};

export default async function BlogPage() {
    const posts = await fetchPosts();

    return <BlogClient posts={posts} />;
}
