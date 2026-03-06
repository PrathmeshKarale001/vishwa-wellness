'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'What is Bhasma and how is it created?',
        answer: 'Bhasma is sacred ash created through precise Vedic fire rituals. It is produced by consecrating specific materials through controlled burning in ceremonial fires, following ancient protocols that have been preserved for thousands of years. The process involves specific mantras, timing, and intentions that transform ordinary materials into powerful healing substances.',
    },
    {
        question: 'Are your products safe to use?',
        answer: 'Absolutely. All our products are created following traditional Ayurvedic protocols and meet modern safety standards. The ash used in our products comes from carefully selected natural materials, processed through sacred fire ceremonies. However, as with any wellness product, we recommend consulting with a healthcare practitioner if you have specific health concerns.',
    },
    {
        question: 'How do I start practicing the Bhasma rituals?',
        answer: 'The best way to begin is with our Bhasma Snān (ash bath ritual), which is the most accessible practice. You can purchase our ritual kit that includes detailed instructions, or join one of our workshops or retreats for hands-on guidance from experienced practitioners. We provide step-by-step guidance for all three rituals.',
    },
    {
        question: 'What can I expect from an Agnihotra Wellness Retreat?',
        answer: 'Our Agnihotra Wellness Retreats offer a transformative 3-7 day experience that includes sacred fire ceremonies, personalized healing consultations, hands-on training in all three Bhasma rituals, organic meals, and time for rest and integration. You\'ll be guided by experienced practitioners in a serene natural setting designed to support deep healing.',
    },
    {
        question: 'Do I need any prior experience with yoga or meditation?',
        answer: 'No prior experience is necessary. Our practices are accessible to everyone, regardless of background or experience level. We provide comprehensive guidance and support for beginners, while also offering depth for experienced practitioners. The rituals work at the physical, energetic, and spiritual levels, meeting you wherever you are.',
    },
    {
        question: 'How is this different from other Ayurvedic products?',
        answer: 'Our approach uniquely combines authentic Vedic fire rituals with carefully selected ingredients and rigorous quality standards. Unlike mass-produced products, each batch of Bhasma is created through traditional ceremonies with specific intentions. We also emphasize the spiritual dimension of healing, not just the physical application.',
    },
    {
        question: 'Can I practice these rituals at home?',
        answer: 'Yes! All our products come with detailed instructions for home practice. While attending a retreat or workshop deepens your understanding, the daily practices can absolutely be incorporated into your home routine. We provide ongoing support through our online resources and community.',
    },
    {
        question: 'What results can I expect and how quickly?',
        answer: 'Results vary by individual and depend on consistency of practice. Many people report improved energy, better sleep, and enhanced mental clarity within the first few weeks. Deeper transformations in physical health, emotional patterns, and spiritual awareness typically unfold over 2-3 months of regular practice. We recommend committing to at least 40 days for optimal results.',
    },
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="bg-white border border-[#eee] rounded-lg overflow-hidden hover:border-[var(--color-primary)]/30 transition-colors"
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                        aria-expanded={openIndex === index}
                    >
                        <span className="font-semibold text-[#222] text-base pr-4 group-hover:text-[var(--color-primary)] transition-colors">
                            {faq.question}
                        </span>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                            {openIndex === index ? (
                                <Minus className="w-4 h-4 text-[var(--color-primary)] group-hover:text-white" />
                            ) : (
                                <Plus className="w-4 h-4 text-[var(--color-primary)] group-hover:text-white" />
                            )}
                        </div>
                    </button>

                    <AnimatePresence initial={false}>
                        {openIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <div className="px-6 pb-5 text-[#666] leading-relaxed">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
