"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Droplets,
    Hand,
    Flame,
    Clock,
    Thermometer,
    ShoppingBag,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Ritual } from "@/types";

interface RitualsContentProps {
    rituals: Ritual[];
}

const getIcon = (slug: string) => {
    if (slug.includes('snan')) return Droplets;
    if (slug.includes('lepam')) return Hand;
    if (slug.includes('pana')) return Flame;
    return Droplets;
};

export default function RitualsContent({ rituals }: RitualsContentProps) {
    // Hardcoded fallback data to ensure page content is always visible
    const fallbackRituals: Ritual[] = [
        {
            _id: "ritual-snan",
            slug: "bhasma-snan",
            name: "Bhasma Snan",
            sanskritName: "Agni Snan",
            subtitle: "The Sacred Ash Bath for Aura Purification",
            description: "Bhasma Snan is the ancient practice of bathing in sacred ash. Unlike water which cleanses the physical body, ash cleanses the etheric body (Aura). It removes deep-seated impurities, energetic blockages, and excess moisture (Kapha) from the system.",
            benefits: [
                "Purifies the Aura and energetic field",
                "Removes excess Kapha and moisture from the body",
                "Enhances natural skin glow and texture",
                "Provides deep grounding and stability"
            ],
            steps: [
                { stepNumber: 1, content: "Take a handful of sacred Bhasma in your palms." },
                { stepNumber: 2, content: "Apply vigoriously over the entire body before a water bath." },
                { stepNumber: 3, content: "Focus on joints and vital marma points." },
                { stepNumber: 4, content: "Leave on for 5-10 minutes to absorb toxins." }
            ],
            frequency: "Daily or Weekly",
            temperature: "Room Temperature",
            image: "/rituals/snan-landscape.png",
            iconImage: "/rituals/snan-icon.png",
            products: []
        },
        {
            _id: "ritual-lepam",
            slug: "bhasma-lepam",
            name: "Bhasma Lepam",
            sanskritName: "Lepam",
            subtitle: "Targeted Ash Application for Pain & Healing",
            description: "Lepam involves applying a thick paste of Bhasma mixed with water or herbal oils to specific areas of the body. It is highly effective for drawing out inflammation, reducing pain, and healing skin conditions.",
            benefits: [
                "Reduces local inflammation and swelling",
                "Alleviates joint pain and muscle soreness",
                "Accelerates healing of skin irritations",
                "Draws out toxins from specific organs"
            ],
            steps: [
                { stepNumber: 1, content: "Mix Bhasma with water or recommended oil to form a paste." },
                { stepNumber: 2, content: "Apply a thick layer over the affected area." },
                { stepNumber: 3, content: "Let it dry completely (approx. 20-30 mins)." },
                { stepNumber: 4, content: "Wash off gently with cool water." }
            ],
            frequency: "As needed for pain/healing",
            temperature: "Cool or Warm Paste",
            image: "/rituals/lepam-landscape.png",
            iconImage: "/rituals/lepam-icon.png",
            products: []
        },
        {
            _id: "ritual-pana",
            slug: "bhasma-pana",
            name: "Bhasma Pana",
            sanskritName: "Bhasma Pana",
            subtitle: "Internal Consumption for Cellular Alchemy",
            description: "The most subtle and powerful practice, Bhasma Pana involves consuming a pinch of pharmaceutical-grade Bhasma with water or honey. It works at a cellular level to alkalize the body and enhance bio-magnetism.",
            benefits: [
                "Alkalizes the body and balances pH",
                "Enhances digestion and nutrient absorption",
                "Boosts immunity and cellular repair",
                "Increases mental clarity and focus"
            ],
            steps: [
                { stepNumber: 1, content: "Take a pinch of Edible Bhasma (check label)." },
                { stepNumber: 2, content: "Mix with a glass of copper-charged water." },
                { stepNumber: 3, content: "Consume on an empty stomach in the morning." },
                { stepNumber: 4, content: "Wait 30 mins before eating breakfast." }
            ],
            frequency: "Daily Morning",
            image: "/rituals/pana-landscape.png",
            iconImage: "/rituals/pana-icon.png",
            products: []
        }
    ];

    const displayRituals = (rituals && rituals.length > 0) ? rituals : fallbackRituals;

    return (
        <>
            {/* Hero */}
            <section className="relative min-h-[75vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-beige)] to-[var(--color-cream)]" />
                <div className="absolute inset-0 z-0">
                    <img
                        src="/firelineage.jpg"
                        alt="Bhasma Rituals Background"
                        className="w-full h-full object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cream)] via-transparent to-[var(--color-beige)]/50" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-block px-4 py-1 rounded-full bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20 mb-8">
                            <span className="text-[var(--color-terracotta)] text-xs font-bold uppercase tracking-[0.2em]">Sacred Practices</span>
                        </div>

                        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-navy)] mb-6 leading-[1.1]">
                            Bhasma Rituals
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--color-ash)] max-w-2xl mx-auto mb-12 leading-relaxed">
                            Three sacred practices passed down through fire lineages.
                            Each ritual serves a specific healing purpose.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Ritual Navigation */}
            <Section background="white" className="!py-8">
                <div className="flex flex-wrap justify-center gap-4">
                    {displayRituals.map((ritual) => {
                        const Icon = getIcon(ritual.slug);
                        return (
                            <a
                                key={ritual._id}
                                href={`#${ritual._id}`}
                                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-beige)] text-[var(--color-text)] border-2 border-[var(--color-beige)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all duration-300 font-medium uppercase tracking-wide text-sm"
                            >
                                {ritual.iconImage ? (
                                    <img src={ritual.iconImage} alt="" className="w-5 h-5 object-contain mix-blend-screen hover:mix-blend-normal" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                                <span>{ritual.name}</span>
                            </a>
                        );
                    })}
                </div>
            </Section>

            {/* Ritual Sections */}
            {displayRituals.map((ritual, index) => {
                const Icon = getIcon(ritual.slug);
                return (
                    <Section
                        key={ritual._id}
                        id={ritual._id}
                        background={index % 2 === 0 ? "cream" : "white"}
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-ochre)] flex items-center justify-center flex-shrink-0 shadow-lg p-2 overflow-hidden">
                                        {ritual.iconImage ? (
                                            <img src={ritual.iconImage} alt="" className="w-full h-full object-contain mix-blend-screen scale-110" />
                                        ) : (
                                            <Icon className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[var(--color-navy)] mb-1">
                                            {ritual.name}
                                        </h2>
                                        {ritual.subtitle && <p className="text-[var(--color-terracotta)] text-lg">{ritual.subtitle}</p>}
                                    </div>
                                </div>

                                <p className="text-[var(--color-charcoal)] text-lg leading-relaxed">
                                    {ritual.description}
                                </p>

                                <div>
                                    <h3 className="font-semibold text-[var(--color-navy)] mb-4 text-lg">Benefits</h3>
                                    <ul className="space-y-3">
                                        {ritual.benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                                <span className="text-[var(--color-charcoal)] leading-relaxed">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Quick Info */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-[var(--color-beige)] shadow-sm">
                                        <Clock className="w-4 h-4 text-[var(--color-terracotta)]" />
                                        <span className="text-sm font-medium">{ritual.frequency}</span>
                                    </div>
                                    {ritual.temperature && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-[var(--color-beige)] shadow-sm">
                                            <Thermometer className="w-4 h-4 text-[var(--color-terracotta)]" />
                                            <span className="text-sm font-medium">{ritual.temperature}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Right: Steps & Products */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                    <img
                                        src={ritual.image}
                                        alt={ritual.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                                </div>

                                <Card variant="bordered">
                                    <CardContent className="p-6">
                                        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--color-navy)] mb-6">
                                            How to Practice
                                        </h3>
                                        <ol className="space-y-4">
                                            {ritual.steps.map((step, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <span className="w-8 h-8 rounded-full bg-[var(--color-terracotta)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-terracotta)] font-semibold text-sm">
                                                        {step.stepNumber || i + 1}
                                                    </span>
                                                    <p className="text-[var(--color-charcoal)] pt-1 leading-relaxed">{step.content}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </CardContent>
                                </Card>

                                {ritual.products && ritual.products.length > 0 && (
                                    <Card variant="elevated" className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy)]/90 text-white shadow-xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <ShoppingBag className="w-5 h-5 text-[var(--color-ochre)]" />
                                                <h3 className="font-semibold !text-white">Recommended Products</h3>
                                            </div>
                                            <ul className="space-y-2 mb-6">
                                                {ritual.products.map((product) => (
                                                    <li key={product._id} className="text-gray-300 flex items-start gap-2">
                                                        <span className="text-[var(--color-ochre)] mt-1">•</span>
                                                        <span>{product.title}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Link href="/agni-products">
                                                <Button className="w-full bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)] transition-colors shadow-md">
                                                    Shop {ritual.name} Products
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                )}
                            </motion.div>
                        </div>
                    </Section>
                );
            })}

            {/* CTA */}
            <Section background="beige">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-navy)] mb-6">
                        Ready to Begin Your Ritual Practice?
                    </h2>
                    <p className="text-[var(--color-charcoal)] mb-8">
                        Explore our curated collection of Agni-Infused products designed for each sacred ritual.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/agni-products">
                            <Button>
                                Shop All Products
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/awt-retreats">
                            <Button variant="outline">
                                Learn at a Retreat
                            </Button>
                        </Link>
                    </div>
                </div>
            </Section>
        </>
    );
}
