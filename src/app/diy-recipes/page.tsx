import { fetchDiyRecipes } from '@/lib/sanity.fetch';
import DIYRecipesClient from './DIYRecipesClient';

export default async function DIYRecipesPage() {
    const recipes = await fetchDiyRecipes();

    return <DIYRecipesClient recipes={recipes} />;
}
