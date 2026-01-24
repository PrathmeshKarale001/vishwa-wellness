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
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";

const rituals = [
    {
        id: "snan",
        icon: Droplets,
        title: "Bhasma Snān™",
        subtitle: "Sacred Ash Bath Ritual",
        image: "/package-1.jpg",
        description: "A full-body purification practice using consecrated ash mixed with water. This ritual cleanses not just the skin, but the entire energy field.",
        benefits: [
            "Deep skin detoxification",
            "Energetic field cleansing",
            "Stress and tension release",
            "Improved skin texture"
        ],
        steps: [
            "Prepare warm water (not hot) in your bathing vessel",
            "Add 2-3 tablespoons of Bhasma Snān powder",
            "Stir to create a milky suspension",
            "Immerse or pour over body with intention",
            "Allow to sit for 5-10 minutes",
            "Rinse gently, pat dry"
        ],
        frequency: "Weekly or bi-weekly",
        temperature: "Warm (37-40°C)",
        products: ["Bhasma Snān Powder", "Ritual Soap", "Skin Purifier"]
    },
    {
        id: "lepam",
        icon: Hand,
        title: "Bhasma Lepam\u2122",
        subtitle: "Ash Application Therapy",
        image: "/package-2.jpg",
        description: "The ancient art of applying ash paste to specific points on the body \u2014 forehead, throat, heart, and joints \u2014 for targeted healing and protection.",
        benefits: [
            "Joint pain relief",
            "Skin healing acceleration",
            "Third-eye activation",
            "Protective energy barrier"
        ],
        steps: [
            "Mix ash with rose water or coconut oil to form paste",
            "Apply to forehead (third eye) with ring finger",
            "Apply to throat center",
            "Apply to heart center",
            "Apply to affected joints or skin areas",
            "Leave for 15-30 minutes, then rinse or leave overnight"
        ],
        frequency: "Daily or as needed",
        temperature: "Room temperature",
        products: ["Healing Balm", "Face Pack", "Joint Oil"]
    },
    {
        id: "pana",
        icon: Flame,
        title: "Bhasma P\u0101na\u2122",
        subtitle: "Internal Agni Jal Ritual",
        image: "/agnijal.jpg",
        description: "The mystical practice of consuming ash-infused water to ignite the internal digestive fire (Agni) and purify the body from within.",
        benefits: [
            "Digestive fire enhancement",
            "Internal detoxification",
            "Alkalinity boost",
            "Mental clarity"
        ],
        steps: [
            "Use only certified, food-grade ritual ash",
            "Add a pinch (1/4 tsp) to a copper vessel of water",
            "Let sit overnight (minimum 8 hours)",
            "Strain through fine cloth in the morning",
            "Drink on empty stomach with intention",
            "Wait 30 minutes before eating"
        ],
        frequency: "Weekly or during detox periods",
        temperature: "Room temperature",
        products: ["Agni Jal Ash", "Copper Vessel", "Fine Sieve Kit"]
    }
];

export default function BhasmaRitualsPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative min-h-[75vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
                {/* Background layers */}
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
                    {rituals.map((ritual) => (
                        <a
                            key={ritual.id}
                            href={`#${ritual.id}`}
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-beige)] text-[var(--color-text)] border-2 border-[var(--color-beige)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all duration-300 font-medium uppercase tracking-wide text-sm"
                        >
                            <ritual.icon className="w-5 h-5" />
                            <span>{ritual.title}</span>
                        </a>
                    ))}
                </div>
            </Section>

            {/* Ritual Sections */}
            {rituals.map((ritual, index) => (
                <Section
                    key={ritual.id}
                    id={ritual.id}
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
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-ochre)] flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <ritual.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[var(--color-navy)] mb-1">
                                        {ritual.title}
                                    </h2>
                                    <p className="text-[var(--color-terracotta)] text-lg">{ritual.subtitle}</p>
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
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-[var(--color-beige)] shadow-sm">
                                    <Thermometer className="w-4 h-4 text-[var(--color-terracotta)]" />
                                    <span className="text-sm font-medium">{ritual.temperature}</span>
                                </div>
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
                                    alt={ritual.title}
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
                                                    {i + 1}
                                                </span>
                                                <p className="text-[var(--color-charcoal)] pt-1 leading-relaxed">{step}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card variant="elevated" className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy)]/90 text-white shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShoppingBag className="w-5 h-5 text-[var(--color-ochre)]" />
                                        <h3 className="font-semibold !text-white">Recommended Products</h3>
                                    </div>
                                    <ul className="space-y-2 mb-6">
                                        {ritual.products.map((product) => (
                                            <li key={product} className="text-gray-300 flex items-start gap-2">
                                                <span className="text-[var(--color-ochre)] mt-1">•</span>
                                                <span>{product}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/agni-products">
                                        <Button className="w-full bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)] transition-colors shadow-md">
                                            Shop {ritual.title} Products
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </Section>
            ))}

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
