"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Flame,
    Heart,
    Users,
    Award,
    ArrowRight,
    Quote
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";

const values = [
    {
        icon: Flame,
        title: "Sacred Tradition",
        description: "We honor the fire lineages that have preserved this knowledge for millennia."
    },
    {
        icon: Heart,
        title: "Authentic Healing",
        description: "Every product and ritual is designed for genuine transformation, not quick fixes."
    },
    {
        icon: Users,
        title: "Community",
        description: "We're building a global family of practitioners dedicated to wellness and awakening."
    },
    {
        icon: Award,
        title: "Quality Without Compromise",
        description: "From sourcing to preparation, we never compromise on purity or authenticity."
    }
];

const timeline = [
    { year: "1970s", event: "Our founding teacher begins learning fire rituals from Himalayan masters" },
    { year: "1990s", event: "First public teachings on Bhasma therapy emerge from decades of practice" },
    { year: "2010", event: "AWT (Agni Wellness Therapy) protocol formalized after thousands of successful cases" },
    { year: "2020", event: "Vishwa Wellness founded to bring these teachings to the modern world" },
    { year: "Today", event: "Serving thousands of practitioners across 40+ countries" },
];

const team = [
    {
        name: "Dr. Arun Sharma",
        role: "Founder & Chief Wellness Officer",
        bio: "50+ years in traditional medicine and fire healing practices."
    },
    {
        name: "Priya Devi",
        role: "Head of Rituals",
        bio: "Third-generation fire priestess and ritual design expert."
    },
    {
        name: "Dr. Maya Patel",
        role: "Scientific Advisor",
        bio: "PhD in Biochemistry with focus on traditional medicine validation."
    },
    {
        name: "Ravi Kumar",
        role: "Head of Product Development",
        bio: "Expert in Ayurvedic formulations and quality standards."
    },
];

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <Hero
                badge="Our Story"
                title="About Vishwa Wellness"
                description="Born from 50 years of fire lineage wisdom, bridging ancient healing practices with modern wellness needs."
                bgImage="/firelineage.jpg"
                theme="light"
            />

            {/* Mission Statement */}
            <Section background="white">
                <div className="max-w-4xl mx-auto text-center">
                    <Quote className="w-12 h-12 text-[var(--color-gold)] mx-auto mb-6" />
                    <blockquote className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[var(--color-navy)] italic mb-6">
                        &ldquo;We believe that the ancient wisdom of sacred fire holds the key to
                        healing our modern disconnection from body, nature, and spirit.&rdquo;
                    </blockquote>
                    <p className="text-[var(--color-terracotta)] font-medium">
                        — The Vishwa Wellness Philosophy
                    </p>
                </div>
            </Section>

            {/* Fire Lineage */}
            <Section background="cream">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-6">
                            The Fire Lineage
                        </h2>
                        <p className="leading-relaxed mb-6 opacity-90">
                            For over five decades, our founding teacher traveled the sacred lands of India,
                            learning from Himalayan masters, temple priests, and village healers who had
                            preserved the knowledge of Agni (sacred fire) medicine.
                        </p>
                        <p className="leading-relaxed mb-6 opacity-90">
                            This is not knowledge found in books — it is transmitted through direct
                            experience, rigorous practice, and the blessing of those who came before.
                        </p>
                        <p className="leading-relaxed opacity-90">
                            Today, Vishwa Wellness carries this flame forward, adapting ancient protocols
                            for modern bodies while never compromising on authenticity or sacred intention.
                        </p>
                    </div>
                    <div className="relative rounded-2xl aspect-square overflow-hidden shadow-2xl">
                        <Image
                            src="/firelineage.jpg"
                            alt="The Sacred Fire Lineage"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/40 to-transparent" />
                    </div>
                </div>
            </Section>

            {/* Timeline */}
            <Section background="white">
                <SectionHeading
                    title="Our Journey"
                    subtitle="50 years in the making"
                />

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-0">
                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-6"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-[var(--color-terracotta)]" />
                                    {index < timeline.length - 1 && (
                                        <div className="w-0.5 flex-1 bg-[var(--color-beige)]" />
                                    )}
                                </div>
                                <div className="pb-8">
                                    <span className="text-[var(--color-terracotta)] font-semibold">{item.year}</span>
                                    <p className="mt-1 opacity-90">{item.event}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Values */}
            <Section background="beige">
                <SectionHeading
                    title="Our Values"
                    subtitle="The principles that guide everything we do"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full text-center">
                                <CardContent className="p-8">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-ochre)] flex items-center justify-center">
                                        <value.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm opacity-80">{value.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Team */}
            <Section background="white">
                <SectionHeading
                    title="Our Team"
                    subtitle="The guardians of this sacred knowledge"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card variant="bordered" className="h-full">
                                <div className="aspect-square bg-[var(--color-beige)] flex items-center justify-center">
                                    <Users className="w-16 h-16 text-[var(--color-ash)]" />
                                </div>
                                <CardContent>
                                    <h3 className="font-semibold">{member.name}</h3>
                                    <p className="text-sm text-[var(--color-terracotta)] mb-2">{member.role}</p>
                                    <p className="text-xs opacity-80">{member.bio}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <Section background="navy">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-white mb-6">
                        Join Our Mission
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Whether you&apos;re seeking healing, learning to practice, or looking to
                        bring these offerings to your community — we&apos;d love to connect.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)]">
                            Get in Touch
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </>
    );
}
