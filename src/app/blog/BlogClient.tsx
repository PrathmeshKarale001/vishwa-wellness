"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";
import { BlogPost } from "@/lib/sanity.types";

interface BlogClientProps {
    posts: BlogPost[];
}

export default function BlogClient({ posts }: BlogClientProps) {
    const hasPosts = posts && posts.length > 0;

    return (
        <>
            <Hero
                badge="Wisdom & Knowledge"
                title="Sacred Insights"
                highlight="Blog"
                description="Explore ancient wisdom, modern science, and the transformative power of Agnihotra. Articles on wellness, rituals, and living in harmony with fire."
                bgImage="/firelineage.jpg"
                theme="dark"
            />

            <Section background="white">
                {hasPosts ? (
                    <>
                        <SectionHeading
                            title="Latest Articles"
                            subtitle="Discover the science, stories, and sacred wisdom behind Agnihotra wellness."
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link href={`/blog/${post.slug}`}>
                                        <Card variant="bordered" className="h-full group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                                            {post.mainImage && (
                                                <div className="relative w-full h-52 overflow-hidden">
                                                    <Image
                                                        src={post.mainImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4 text-xs text-[#999] mb-3">
                                                    {post.publishedAt && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    )}
                                                    {post.author?.name && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {post.author.name}
                                                        </span>
                                                    )}
                                                </div>

                                                <CardTitle className="text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                                    {post.title}
                                                </CardTitle>

                                                {post.excerpt && (
                                                    <CardDescription className="text-sm line-clamp-3">
                                                        {post.excerpt}
                                                    </CardDescription>
                                                )}

                                                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
                                                    Read More
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <SectionHeading
                            title="Coming Soon"
                            subtitle="We're preparing insightful articles on Agnihotra, sacred rituals, and holistic wellness. Stay tuned!"
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
                )}
            </Section>
        </>
    );
}
