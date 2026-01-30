"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Flame,
    Droplet,
    Shield,
    Zap,
    Sparkles,
    CircleDot,
    ArrowRight,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Hero } from "@/components/ui/Hero";

const scienceBenefits = [
    {
        icon: Droplet,
        title: "Alkalinity",
        description: "Reduces skin infection and balances pH levels for optimal cellular function."
    },
    {
        icon: Sparkles,
        title: "Nano-minerals",
        description: "Rich in Ca, Mg, K, Zn — essential minerals that repair and strengthen the skin barrier."
    },
    {
        icon: Shield,
        title: "Adsorption",
        description: "Binds toxins, excess oil, and heavy metals, drawing impurities from the body."
    },
    {
        icon: Zap,
        title: "Anti-microbial",
        description: "Removes harmful bacteria while preserving beneficial microbiome."
    },
    {
        icon: CircleDot,
        title: "Anti-inflammatory",
        description: "Reduces swelling, redness, and chronic inflammation at the cellular level."
    },
    {
        icon: Flame,
        title: "Energy Cleansing",
        description: "Grounding, stabilizing, and harmonizing the subtle energy field."
    },
];

const traditions = [
    { name: "Atharva Veda", description: "The fourth Veda contains numerous hymns on the sacred use of ash for healing and protection." },
    { name: "Ayurveda", description: "Bhasma preparations are central to traditional Ayurvedic pharmacology and treatment." },
    { name: "Yoga Traditions", description: "Ash application is integral to many yogic practices and initiations." },
    { name: "Shaiva Rites", description: "The vibhuti (sacred ash) is the most recognized symbol of Shaiva traditions." },
];

export default function WhyAshPage() {
    return (
        <>
            <Hero
                badge="The Hero Ingredient"
                title="Why Ash?"
                description="The oldest medicine on Earth. Revered by every ancient civilization. Now validated by modern science."
                bgImage="/whyash.jpg"
                theme="dark"
            />

            {/* Section 1: The Oldest Medicine */}
            <Section background="white">
                <div className="max-w-4xl mx-auto">
                    <SectionHeading
                        title="The Oldest Medicine on Earth"
                        subtitle="From the Atharva Veda to ancient fire rites across the globe, ash has been humanity's first and most powerful medicine."
                    />

                    <div className="prose prose-lg max-w-none text-center mb-12">
                        <p className="text-[var(--color-charcoal)] leading-relaxed">
                            In the Vedic tradition, ash is not merely a residue — it is the essence of transformation.
                            When fire consumes matter, what remains is pure: cleansed of impurities,
                            imbued with the energy of Agni (the sacred fire). This is why ash appears in:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {traditions.map((tradition, index) => (
                            <motion.div
                                key={tradition.name}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-6 bg-[var(--color-beige)]/50 rounded-xl border border-[var(--color-beige)]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/20 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-5 h-5 text-[var(--color-gold)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-[var(--color-navy)] mb-1">
                                            {tradition.name}
                                        </h3>
                                        <p className="text-[var(--color-ash)] text-sm">
                                            {tradition.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center p-8 bg-gradient-to-r from-[var(--color-terracotta)]/10 via-[var(--color-gold)]/10 to-[var(--color-terracotta)]/10 rounded-2xl border border-[var(--color-gold)]/30">
                        <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[var(--color-navy)] italic">
                            "Where fire burns in purity, ash becomes medicine."
                        </p>
                    </div>
                </div>
            </Section>

            {/* Section 2: Modern Science */}
            <Section background="cream">
                <SectionHeading
                    title="What Makes Ash Powerful?"
                    subtitle="Modern biochemistry now validates what ancient sages knew intuitively."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {scienceBenefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-ochre)] flex items-center justify-center mb-4">
                                <benefit.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--color-navy)] mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-[var(--color-ash)] text-sm leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/bhasma-rituals">
                        <Button>
                            View Bhasma Rituals
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>

            {/* Section 3: Agni-Saṃskāra */}
            <Section background="navy">
                <div className="max-w-4xl mx-auto text-center">
                    <SacredDivider text="Our Process" className="mb-8 !text-[var(--color-ochre)]" />

                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold !text-white mb-6">
                        How We Prepare Our Ash
                    </h2>

                    <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl">
                        <img
                            src="/firelineage.jpg"
                            alt="Agni-Saṃskāra — The Sacred Fire Preparation"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    <p className="text-xl text-[var(--color-ochre)] mb-4">
                        Agni-Saṃskāra — The Sacred Fire Preparation
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
                        Every batch of ash used in our products undergoes a meticulous preparation process
                        rooted in ancient Vedic protocols. This is not industrial production —
                        it is a sacred act of creation.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {[
                            { step: "01", title: "Sacred Materials", desc: "Cow dung cakes, pure ghee, and specific herbs are gathered with intention." },
                            { step: "02", title: "Copper Pyramid", desc: "The fire is lit within a copper pyramid structure to amplify subtle energies." },
                            { step: "03", title: "Vedic Mantras", desc: "Ancient mantras are chanted throughout the burn, infusing the ash with vibration." },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="text-5xl font-[family-name:var(--font-playfair)] text-[var(--color-gold)] mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold !text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <Link href="/agni-products">
                        <Button className="bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)]">
                            Explore Agni-Infused Products
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </>
    );
}
