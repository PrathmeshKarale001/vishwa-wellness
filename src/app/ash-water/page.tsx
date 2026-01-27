"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Droplets,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    GlassWater,
    Sparkles,
    Heart,
    Brain
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";

const ancientBenefits = [
    { icon: Sparkles, title: "Burns Impurities", desc: "Dissolves accumulated toxins (ama) from the body systems" },
    { icon: Brain, title: "Clears Mind Fog", desc: "Sharpens mental clarity and removes mental heaviness" },
    { icon: Heart, title: "Increases Prana", desc: "Enhances vital life force and energy levels" },
    { icon: Droplets, title: "Purifies Blood", desc: "Deep blood cleansing and cardiovascular support" },
];

const modernBenefits = [
    "Alkalizes body pH (7.5-8.5)",
    "Reduces acidity and acid reflux",
    "Natural antimicrobial action",
    "Supports healthy digestion",
    "Mineral supplementation (Ca, Mg, K)",
    "Supports electrolyte balance",
];

const steps = [
    {
        step: 1,
        title: "Gather Materials",
        description: "You'll need: food-grade ritual ash (certified), a clean copper vessel, filtered water, and a fine muslin cloth.",
    },
    {
        step: 2,
        title: "Prepare the Vessel",
        description: "Clean the copper vessel with lemon and salt. Rinse thoroughly. This activates the copper's beneficial properties.",
    },
    {
        step: 3,
        title: "Add Ash",
        description: "Add 1/4 teaspoon of certified ritual ash to 500ml of filtered water in the copper vessel.",
    },
    {
        step: 4,
        title: "Rest Overnight",
        description: "Cover and let sit for minimum 8 hours (ideally overnight). The water will absorb the minerals and energy.",
    },
    {
        step: 5,
        title: "Strain Carefully",
        description: "In the morning, strain through fine muslin cloth twice to remove all particulates.",
    },
    {
        step: 6,
        title: "Drink with Intention",
        description: "Drink on empty stomach, 30 minutes before any food. Set an intention for purification.",
    },
];

const safetyRules = [
    "Use ONLY certified food-grade ritual ash",
    "Never use industrial or commercial ash",
    "Consult a doctor if pregnant or on medication",
    "Start with small amounts (1/8 tsp) and increase gradually",
    "Do not consume daily — weekly or during detox only",
    "Stop immediately if any discomfort occurs",
];

const kitProducts = [
    { name: "Certified Agni Jal Ash", price: "₹599" },
    { name: "Traditional Copper Vessel", price: "₹1,299" },
    { name: "Fine Mesh Sieve (Set of 3)", price: "₹349" },
    { name: "Complete Agni Jal Kit", price: "₹1,999" },
];

export default function AshWaterPage() {
    return (
        <>
            <Hero
                badge="Internal Purification"
                title="Agni Jal™"
                highlight="Sacred Ash Water"
                description="Water infused with sacred ash — used since Vedic times for internal purification and to ignite the digestive fire (Agni)."
                bgImage="/agnijal.jpg"
                theme="light"
            />

            {/* What is Agni Jal */}
            <Section background="white">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-6">
                            What is Agni Jal?
                        </h2>
                        <p className="text-lg leading-relaxed mb-6">
                            Agni Jal (अग्नि जल) literally translates to "Fire Water." It is an ancient preparation
                            where water is infused with the essence of sacred ash, traditionally stored in
                            copper vessels overnight.
                        </p>
                        <p className="leading-relaxed">
                            This practice appears in texts dating back thousands of years and is considered
                            one of the most potent methods for internal purification in the Ayurvedic tradition.
                        </p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="/agnijal.jpg"
                            alt="Agni Jal - Sacred Ash Water"
                            className="w-full h-full object-cover aspect-square"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                </div>
            </Section>

            {/* Benefits */}
            <Section background="cream">
                <SectionHeading
                    title="Benefits of Agni Jal"
                    subtitle="Ancient wisdom meets modern science"
                />

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Ancient */}
                    <div>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
                            </span>
                            Ancient Benefits
                        </h3>
                        <div className="grid gap-4">
                            {ancientBenefits.map((benefit) => (
                                <div key={benefit.title} className="p-4 bg-white rounded-xl flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center flex-shrink-0">
                                        <benefit.icon className="w-5 h-5 text-[var(--color-gold)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{benefit.title}</h4>
                                        <p className="text-sm opacity-70">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modern */}
                    <div>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[var(--color-terracotta)]/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-[var(--color-terracotta)]" />
                            </span>
                            Modern Science
                        </h3>
                        <div className="bg-white rounded-xl p-6">
                            <ul className="space-y-3">
                                {modernBenefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[var(--color-forest)]" />
                                        <span className="">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Section>

            {/* How to Prepare */}
            <Section background="white">
                <SectionHeading
                    title="How to Make Agni Jal"
                    subtitle="A step-by-step guide for safe preparation at home"
                />

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-6"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-ochre)] flex items-center justify-center flex-shrink-0 text-white font-semibold">
                                    {step.step}
                                </div>
                                <div className="pt-2">
                                    <h3 className="font-semibold mb-1">{step.title}</h3>
                                    <p className="opacity-80">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Safety */}
            <Section background="beige">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-terracotta)]/20">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-8 h-8 text-[var(--color-terracotta)]" />
                            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                                Important Safety Rules
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            {safetyRules.map((rule) => (
                                <li key={rule} className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-[var(--color-terracotta)] flex-shrink-0 mt-0.5" />
                                    <span className="">{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            {/* Products */}
            <Section background="white">
                <SectionHeading
                    title="Agni Jal Essentials"
                    subtitle="Everything you need to prepare sacred ash water at home"
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kitProducts.map((product, index) => (
                        <motion.div
                            key={product.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="text-center h-full">
                                <div className="aspect-square bg-[var(--color-beige)] flex items-center justify-center">
                                    <Droplets className="w-16 h-16 text-[var(--color-terracotta)]" />
                                </div>
                                <CardContent>
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <p className="text-xl font-semibold mt-2">
                                        {product.price}
                                    </p>
                                    <Button size="sm" className="mt-4 w-full">Add to Cart</Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/agni-products">
                        <Button variant="outline">
                            Shop All Agni Jal Products
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </>
    );
}
