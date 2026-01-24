import { fetchCategories } from '@/lib/sanity.fetch';
import Header from './Header';

export default async function HeaderWrapper() {
    const categories = await fetchCategories();

    return <Header categories={categories} />;
}
