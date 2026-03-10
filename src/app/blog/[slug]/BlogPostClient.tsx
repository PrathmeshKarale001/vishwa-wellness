"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { BlogPost } from "@/lib/sanity.types";

interface BlogPostClientProps {
    post: BlogPost;
}

// Simple portable text block renderer (handles basic block types)
function RenderBody({ body }: { body: any[] }) {
    if (!body) return null;

    return (
        <div className="prose prose-lg max-w-none">
            {body.map((block, index) => {
                if (block._type === 'block') {
                    const style = block.style || 'normal';
                    const children = block.children
                        ?.map((child: any) => {
                            let text = child.text || '';
                            if (child.marks?.includes('strong')) text = `<strong>${text}</strong>`;
                            if (child.marks?.includes('em')) text = `<em>${text}</em>`;
                            return text;
                        })
                        .join('');

                    switch (style) {
                        case 'h1':
                            return <h1 key={index} className="text-3xl font-bold mt-10 mb-4 font-[family-name:var(--font-playfair)]" dangerouslySetInnerHTML={{ __html: children }} />;
                        case 'h2':
                            return <h2 key={index} className="text-2xl font-bold mt-8 mb-3 font-[family-name:var(--font-playfair)]" dangerouslySetInnerHTML={{ __html: children }} />;
                        case 'h3':
                            return <h3 key={index} className="text-xl font-semibold mt-6 mb-2 font-[family-name:var(--font-playfair)]" dangerouslySetInnerHTML={{ __html: children }} />;
                        case 'h4':
                            return <h4 key={index} className="text-lg font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: children }} />;
                        case 'blockquote':
                            return (
                                <blockquote key={index} className="border-l-4 border-[var(--color-primary)] pl-6 py-2 my-6 italic text-[#555] bg-[var(--color-beige)]/30">
                                    <span dangerouslySetInnerHTML={{ __html: children }} />
                                </blockquote>
                            );
                        default:
                            if (!children || children.trim() === '') return <br key={index} />;
                            return <p key={index} className="mb-4 leading-relaxed text-[#444]" dangerouslySetInnerHTML={{ __html: children }} />;
                    }
                }

                if (block._type === 'image' && block.asset) {
                    return (
                        <div key={index} className="my-8 rounded-lg overflow-hidden">
                            <Image
                                src={block.asset.url || block.asset._ref || ''}
                                alt={block.alt || 'Blog image'}
                                width={800}
                                height={450}
                                className="w-full h-auto"
                            />
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
    return (
        <>
            <Hero
                badge="Blog"
                title={post.title}
                description={post.excerpt || ''}
                bgImage={post.mainImage || '/firelineage.jpg'}
                theme="dark"
            />

            <Section background="white">
                <div className="max-w-3xl mx-auto">
                    {/* Meta info */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center gap-6 mb-10 pb-6 border-b border-[var(--color-beige)]"
                    >
                        {post.author?.name && (
                            <div className="flex items-center gap-3">
                                {post.author.image && (
                                    <Image
                                        src={post.author.image}
                                        alt={post.author.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                )}
                                <div>
                                    <p className="text-xs text-[#999] uppercase tracking-wider">Author</p>
                                    <p className="text-sm font-medium">{post.author.name}</p>
                                </div>
                            </div>
                        )}
                        {post.publishedAt && (
                            <div className="flex items-center gap-2 text-sm text-[#777]">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Body */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {post.body && <RenderBody body={post.body} />}
                    </motion.div>

                    {/* Back link */}
                    <div className="mt-12 pt-8 border-t border-[var(--color-beige)]">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </Section>
        </>
    );
}
