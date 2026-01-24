"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Droplets,
    Hand,
    GlassWater,
    Home,
    ArrowRight,
    Star,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardImage, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";

const categories = [
    {
        id: "snan",
        icon: Droplets,
        title: "Bhasma Snān Products",
        description: "Sacred bath preparations for full-body purification",
        products: [
            { name: "Bhasma Snān Powder", price: "₹899", rating: 4.9 },
            { name: "Ritual Cleansing Soap", price: "₹349", rating: 4.8 },
            { name: "Skin Purifier Wash", price: "₹649", rating: 4.7 },
            { name: "Bath Oil Infusion", price: "₹1,299", rating: 4.9 },
        ]
    },
    {
        id: "lepam",
        icon: Hand,
        title: "Bhasma Lepam Products",
        description: "Healing balms and applications for targeted therapy",
        products: [
            { name: "Sacred Healing Balm", price: "₹799", rating: 4.9 },
            { name: "Ash Face Pack", price: "₹549", rating: 4.8 },
            { name: "Joint Relief Oil", price: "₹949", rating: 4.7 },
            { name: "Hair Restoration Oil", price: "₹749", rating: 4.6 },
        ]
    },
    {
        id: "pana",
        icon: GlassWater,
        title: "Bhasma Pāna Products",
        description: "Internal detox preparations and ash-herb blends",
        products: [
            { name: "Agni Jal Ash Powder", price: "₹599", rating: 4.9 },
            { name: "Detox Herb Blend", price: "₹449", rating: 4.8 },
            { name: "Digestive Fire Tablets", price: "₹349", rating: 4.7 },
            { name: "Morning Ritual Kit", price: "₹1,499", rating: 4.9 },
        ]
    },
    {
        id: "home",
        icon: Home,
        title: "Home Energy Purification",
        description: "Perfumes, mists, and energy cleansing products",
        products: [
            { name: "Sacred Space Mist", price: "₹699", rating: 4.8 },
            { name: "Agni Perfume", price: "₹1,299", rating: 4.9 },
            { name: "Room Purifier Incense", price: "₹249", rating: 4.7 },
            { name: "Energy Cleansing Kit", price: "₹1,799", rating: 4.9 },
        ]
    },
];

export default function AgniProductsPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-beige)] to-[var(--color-cream)]" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <SacredDivider text="Shop" className="mb-8" />

                        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
                            Agni-Infused™ Products
                        </h1>

                        <p className="text-xl max-w-2xl mx-auto opacity-80">
                            Each product begins with sacred ash, prepared through ancient Agni-Saṃskāra rituals.
                            Organized by the ritual they serve.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Navigation */}
            <Section background="white" className="!py-8 sticky top-20 z-30 shadow-sm">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((cat) => (
                        <a
                            key={cat.id}
                            href={`#${cat.id}`}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-cream)] text-[var(--color-text)] border-2 border-[var(--color-cream)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.title.split(" ")[0]} {cat.title.split(" ")[1]}
                        </a>
                    ))}
                </div>
            </Section>

            {/* Product Categories */}
            {categories.map((category, index) => (
                <Section
                    key={category.id}
                    id={category.id}
                    background={index % 2 === 0 ? "cream" : "white"}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-ochre)] flex items-center justify-center">
                            <category.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-semibold">
                                {category.title}
                            </h2>
                            <p className="opacity-80">{category.description}</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {category.products.map((product, i) => (
                            <motion.div
                                key={product.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="group cursor-pointer h-full">
                                    <CardImage alt={product.name} aspectRatio="square" />
                                    <CardContent>
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="w-4 h-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                                            <span className="text-sm opacity-80">{product.rating}</span>
                                        </div>
                                        <CardTitle className="group-hover:text-[var(--color-terracotta)] transition-colors text-lg">
                                            {product.name}
                                        </CardTitle>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-lg font-semibold">
                                                {product.price}
                                            </span>
                                            <Button size="sm" className="px-4">
                                                Add
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            ))}

            {/* Bottom CTA */}
            <Section background="navy">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-white mb-6">
                        Not Sure Where to Start?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Book a free consultation with our wellness advisors to discover
                        the perfect ritual and products for your journey.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)]">
                            Book Free Consultation
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </>
    );
}
