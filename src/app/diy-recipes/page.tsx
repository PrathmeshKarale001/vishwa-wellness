"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";

const categories = [
    {
        id: "skin-beauty",
        title: "Skin & Beauty",
        recipes: [
            {
                title: "Ash + Rose Water Glow Pack",
                time: "20 mins",
                difficulty: "Easy",
                ingredients: ["2 tsp ritual ash", "3 tbsp rose water", "1 tsp honey"],
                steps: [
                    "Mix ash with rose water to form smooth paste",
                    "Add honey and blend well",
                    "Apply to clean face, avoiding eyes",
                    "Leave for 15 minutes",
                    "Rinse with lukewarm water"
                ],
                benefits: "Brightens skin, reduces pigmentation, deep cleansing"
            },
            {
                title: "Ash Exfoliating Scrub",
                time: "10 mins",
                difficulty: "Easy",
                ingredients: ["1 tsp fine ash", "2 tbsp coconut oil", "1 tbsp sugar"],
                steps: [
                    "Mix all ingredients in a bowl",
                    "Massage gently on damp skin",
                    "Focus on rough areas",
                    "Rinse thoroughly",
                    "Pat dry and moisturize"
                ],
                benefits: "Removes dead skin, smooths texture, deep cleansing"
            },
            {
                title: "Ash Hair Mask",
                time: "45 mins",
                difficulty: "Medium",
                ingredients: ["2 tbsp ash", "3 tbsp yogurt", "1 tbsp coconut oil"],
                steps: [
                    "Mix ash with yogurt until smooth",
                    "Add warmed coconut oil",
                    "Apply to scalp and hair",
                    "Cover with shower cap for 30 mins",
                    "Wash with mild shampoo"
                ],
                benefits: "Reduces dandruff, strengthens roots, adds shine"
            },
            {
                title: "Brightening Face Toner",
                time: "5 mins",
                difficulty: "Easy",
                ingredients: ["1/4 tsp ash", "100ml rose water", "5 drops tea tree oil"],
                steps: [
                    "Add ash to rose water",
                    "Shake vigorously",
                    "Let settle for 1 hour",
                    "Strain through muslin cloth",
                    "Add tea tree oil, store in spray bottle"
                ],
                benefits: "Tightens pores, balances oil, refreshes skin"
            }
        ]
    },
    {
        id: "health-firstaid",
        title: "Health & First Aid",
        recipes: [
            {
                title: "Ash Paste for Minor Burns",
                time: "5 mins",
                difficulty: "Easy",
                ingredients: ["1 tsp pure ash", "Aloe vera gel"],
                steps: [
                    "Mix ash with aloe vera to form paste",
                    "Cool the burn under water first",
                    "Apply thin layer to affected area",
                    "Cover lightly with gauze",
                    "Reapply every 4-6 hours"
                ],
                benefits: "Cools burn, prevents infection, speeds healing"
            },
            {
                title: "Ash + Honey Throat Remedy",
                time: "5 mins",
                difficulty: "Easy",
                ingredients: ["Pinch of ritual ash", "1 tbsp raw honey", "Warm water"],
                steps: [
                    "Add ash to warm water (not hot)",
                    "Add honey and stir well",
                    "Gargle for 30 seconds",
                    "Spit out, do not swallow",
                    "Repeat 2-3 times daily"
                ],
                benefits: "Soothes sore throat, kills bacteria, reduces inflammation"
            },
            {
                title: "Joint Pain Relief Paste",
                time: "15 mins",
                difficulty: "Medium",
                ingredients: ["2 tbsp ash", "1 tbsp sesame oil", "1/4 tsp turmeric"],
                steps: [
                    "Warm sesame oil slightly",
                    "Mix in ash and turmeric",
                    "Apply to painful joints",
                    "Massage gently for 5 mins",
                    "Leave overnight, wash in morning"
                ],
                benefits: "Reduces inflammation, relieves stiffness, mineral absorption"
            },
            {
                title: "Digestive Reset Water",
                time: "8 hours",
                difficulty: "Easy",
                ingredients: ["1/4 tsp ash", "500ml water", "Copper vessel"],
                steps: [
                    "Add ash to water in copper vessel",
                    "Cover and let sit overnight (8+ hours)",
                    "Strain through fine cloth",
                    "Drink on empty stomach",
                    "Wait 30 mins before eating"
                ],
                benefits: "Alkalizes body, improves digestion, detoxifies"
            }
        ]
    },
    {
        id: "home-aura",
        title: "Home & Aura",
        recipes: [
            {
                title: "Ash Floor Cleanser",
                time: "10 mins",
                difficulty: "Easy",
                ingredients: ["2 tbsp ash", "1 bucket warm water", "Few drops lemon"],
                steps: [
                    "Add ash to warm water",
                    "Add lemon drops",
                    "Stir well until dissolved",
                    "Mop floors as usual",
                    "Allow to air dry"
                ],
                benefits: "Purifies space, removes negative energy, natural disinfectant"
            },
            {
                title: "Ash Corner Purification",
                time: "15 mins",
                difficulty: "Easy",
                ingredients: ["Small amount of ash", "Intention"],
                steps: [
                    "Take a pinch of sacred ash",
                    "Walk to each corner of the room",
                    "Place a small amount in each corner",
                    "Set intention for purification",
                    "Leave for 24 hours, then sweep"
                ],
                benefits: "Clears stagnant energy, protects space, invokes sacred"
            },
            {
                title: "Energy Clearing Spray",
                time: "24 hours",
                difficulty: "Medium",
                ingredients: ["1/4 tsp ash", "200ml distilled water", "Essential oils"],
                steps: [
                    "Infuse water with ash overnight",
                    "Strain through fine cloth",
                    "Add 10 drops of sage or frankincense oil",
                    "Pour into spray bottle",
                    "Spray corners, doorways, and linens"
                ],
                benefits: "Freshens space, clears energy, uplifts atmosphere"
            },
            {
                title: "Threshold Protection Line",
                time: "5 mins",
                difficulty: "Easy",
                ingredients: ["Sacred ash", "Mantra or prayer"],
                steps: [
                    "Take sacred ash in your right hand",
                    "Stand at main entrance",
                    "Draw a thin line across the threshold",
                    "Recite protective mantra or prayer",
                    "Renew weekly or after heavy rain"
                ],
                benefits: "Protects home, wards negativity, sacred boundary"
            }
        ]
    }
];

export default function DIYRecipesPage() {
    return (
        <>
            <Hero
                badge="Ancient Remedies"
                title="DIY Ash Recipes"
                description="Twelve ancient ash-based remedies you can start tonight. Simple, safe, and profoundly effective."
                bgImage="/ash-recipe-1.jpg"
                theme="light"
            />

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
                    <Link href="/agni-products">
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
