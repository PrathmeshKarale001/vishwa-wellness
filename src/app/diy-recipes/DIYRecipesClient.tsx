"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";
import { DiyRecipe } from "@/lib/sanity.types";

const categoryLabels: Record<string, string> = {
    'skin-beauty': 'Skin & Beauty',
    'health-firstaid': 'Health & First Aid',
    'home-aura': 'Home & Aura',
};

interface DIYRecipesClientProps {
    recipes: DiyRecipe[];
}

export default function DIYRecipesClient({ recipes }: DIYRecipesClientProps) {
    const hasRecipes = recipes && recipes.length > 0;

    // Group recipes by category
    const categories = hasRecipes
        ? Object.entries(
            recipes.reduce((acc, recipe) => {
                const cat = recipe.category || 'skin-beauty';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(recipe);
                return acc;
            }, {} as Record<string, DiyRecipe[]>)
        ).map(([id, recs]) => ({
            id,
            title: categoryLabels[id] || id,
            recipes: recs.map(r => ({
                title: r.title,
                time: r.time,
                difficulty: r.difficulty,
                ingredients: r.ingredients,
                steps: r.steps,
                benefits: r.benefits,
            })),
        }))
        : [];

    return (
        <>
            <Hero
                badge="Ancient Remedies"
                title="DIY Ash Recipes"
                description="Twelve ancient ash-based remedies you can start tonight. Simple, safe, and profoundly effective."
                bgImage="/ash-recipe-1.jpg"
                theme="dark"
            />

            {hasRecipes ? (
                <>
                    {/* Category Nav */}
                    <Section background="white" className="!py-6">
                        <div className="flex flex-wrap justify-center gap-4">
                            {categories.map((cat) => (
                                <a
                                    key={cat.id}
                                    href={`#${cat.id}`}
                                    className="px-6 py-3 bg-[var(--color-beige)] text-[var(--color-text)] border-2 border-[var(--color-beige)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all duration-300 font-medium uppercase tracking-wide text-sm"
                                >
                                    {cat.title}
                                </a>
                            ))}
                        </div>
                    </Section>

                    {/* Recipe Categories */}
                    {categories.map((category, catIndex) => (
                        <Section
                            key={category.id}
                            id={category.id}
                            background={catIndex % 2 === 0 ? "cream" : "white"}
                        >
                            <SectionHeading
                                title={category.title}
                                align="left"
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                {category.recipes.map((recipe, index) => (
                                    <motion.div
                                        key={recipe.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card variant="bordered" className="h-full">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="px-3 py-1 bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)] text-xs font-medium rounded-full flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {recipe.time}
                                                    </span>
                                                    <span className="px-3 py-1 bg-[var(--color-forest)]/10 text-[var(--color-forest)] text-xs font-medium rounded-full">
                                                        {recipe.difficulty}
                                                    </span>
                                                </div>

                                                <CardTitle className="text-xl mb-3">{recipe.title}</CardTitle>

                                                <div className="mb-4">
                                                    <p className="text-sm font-medium mb-2">Ingredients:</p>
                                                    <p className="text-sm opacity-80">
                                                        {recipe.ingredients.join(" • ")}
                                                    </p>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="text-sm font-medium mb-2">Steps:</p>
                                                    <ol className="text-sm opacity-80 space-y-1">
                                                        {recipe.steps.map((step, i) => (
                                                            <li key={i} className="flex gap-2">
                                                                <span className="text-[var(--color-terracotta)]">{i + 1}.</span>
                                                                {step}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>

                                                <div className="pt-4 border-t border-[var(--color-beige)]">
                                                    <div className="flex items-start gap-2">
                                                        <Sparkles className="w-4 h-4 text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
                                                        <p className="text-sm">
                                                            <span className="font-medium">Benefits:</span> <span className="opacity-80">{recipe.benefits}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </Section>
                    ))}
                </>
            ) : (
                <Section background="cream">
                    <div className="text-center py-16">
                        <SectionHeading
                            title="Coming Soon"
                            subtitle="We're preparing ancient ash-based remedies for you. Stay tuned for our complete recipe collection!"
                        />
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 px-8 py-3 bg-[var(--color-primary)] text-white font-medium tracking-wide hover:bg-[var(--color-primary-dark)] transition-colors"
                            >
                                Back to Home
                            </motion.button>
                        </Link>
                    </div>
                </Section>
            )}

            {/* CTA */}
            <Section background="navy">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-white mb-6">
                        Get the Ingredients
                    </h2>
                    <p className="text-gray-300 mb-8">
                        All our DIY recipes use certified, ritual-grade ash prepared through
                        authentic Agni-Saṃskāra process.
                    </p>
                    <Link href="/shop">
                        <Button className="bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)]">
                            Shop Ritual Ash
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </>
    );
}
