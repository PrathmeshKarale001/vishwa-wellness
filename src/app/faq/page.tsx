'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Search } from 'lucide-react';

const faqCategories = [
    {
        title: 'Products & Ingredients',
        faqs: [
            {
                question: 'What is Bhasma (sacred ash)?',
                answer: 'Bhasma is sacred ash created through the ancient Agni-Saṃskāra process. It is prepared by burning specific woods and herbs in consecrated fire ceremonies, resulting in purified ash rich in minerals and spiritual energy. This practice has been used for thousands of years in Ayurvedic and Vedic traditions for healing and purification.'
            },
            {
                question: 'Are your products safe for all skin types?',
                answer: 'Yes, our products are formulated with natural ingredients and are suitable for most skin types. However, we always recommend doing a patch test before first use, especially if you have sensitive skin. If you have specific skin conditions, please consult with a dermatologist before use.'
            },
            {
                question: 'What makes Agni-Infused™ products different?',
                answer: 'Our Agni-Infused™ products begin with sacred ash prepared through authentic Vedic rituals. Unlike commercial products, each batch is blessed and energized through traditional fire ceremonies, carrying both physical benefits (minerals, detox properties) and spiritual energy for holistic wellness.'
            },
            {
                question: 'How long do products last once opened?',
                answer: 'Most of our products have a shelf life of 12-18 months when stored properly. Once opened, we recommend using within 6 months for optimal efficacy. Store in a cool, dry place away from direct sunlight.'
            },
        ]
    },
    {
        title: 'Orders & Shipping',
        faqs: [
            {
                question: 'What are your shipping options?',
                answer: 'We offer free standard shipping (5-7 business days) on all orders across India. Express shipping (2-3 business days) is also available for an additional charge. International shipping is available to select countries with delivery times of 10-15 business days.'
            },
            {
                question: 'How can I track my order?',
                answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order through our website or the courier partner\'s website. You can also check order status in your account dashboard.'
            },
            {
                question: 'Do you ship internationally?',
                answer: 'Yes, we ship to select countries including USA, UK, Canada, Australia, UAE, and Singapore. International shipping costs and delivery times vary by destination. Some products may have restrictions based on local regulations.'
            },
            {
                question: 'What if my order arrives damaged?',
                answer: 'We take utmost care in packaging, but if your order arrives damaged, please contact us within 48 hours with photos of the damage. We will arrange for a replacement or full refund at no additional cost.'
            },
        ]
    },
    {
        title: 'Returns & Refunds',
        faqs: [
            {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day return policy for unused, unopened products in original packaging. For hygiene reasons, opened personal care products cannot be returned unless defective. Retreat bookings have a separate cancellation policy.'
            },
            {
                question: 'How do I initiate a return?',
                answer: 'To initiate a return, log into your account, go to Order History, and select the order you wish to return. Follow the prompts to generate a return shipping label. Alternatively, contact our customer support team.'
            },
            {
                question: 'When will I receive my refund?',
                answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method. Please allow additional time for the refund to reflect in your account.'
            },
        ]
    },
    {
        title: 'Rituals & Usage',
        faqs: [
            {
                question: 'How do I perform Bhasma Snān?',
                answer: 'Bhasma Snān (ash bath) involves applying ash-infused water or paste to the body before bathing. Mix our Snān powder with water, apply to skin in circular motions, leave for 5-10 minutes, then rinse. Visit our Bhasma Rituals page for detailed instructions.'
            },
            {
                question: 'Can I use multiple rituals together?',
                answer: 'Yes! Many practitioners combine rituals for enhanced benefits. A common routine is Pāna (internal) in the morning, Lepam (topical) during the day for specific concerns, and Snān (bath) in the evening. Listen to your body and adjust as needed.'
            },
            {
                question: 'Is there a best time to perform these rituals?',
                answer: 'Traditionally, early morning (Brahma Muhurta, 4-6 AM) is considered the most auspicious time. However, Snān can be done during regular bath time, and Lepam can be applied as needed. Consistency matters more than exact timing.'
            },
        ]
    },
    {
        title: 'Agnihotra Wellness Retreats',
        faqs: [
            {
                question: 'What is included in an Agnihotra Wellness Retreat?',
                answer: 'Our Agnihotra Wellness Retreats include accommodation, all vegetarian meals, daily ritual practices, yoga and meditation sessions, fire ceremonies, one-on-one consultations, and take-home wellness products. Transportation to the retreat center is not included.'
            },
            {
                question: 'How do I book a retreat?',
                answer: 'Visit our Agnihotra Wellness Retreats page to view upcoming dates and locations. Click "Book Now" to select your preferred retreat, complete registration, and make payment. We recommend booking 2-3 months in advance as spaces are limited.'
            },
            {
                question: 'What is the cancellation policy for retreats?',
                answer: 'Cancellations made 30+ days before the retreat receive a full refund minus booking fee. 15-30 days: 50% refund. Less than 15 days: No refund, but you may transfer your booking to a future retreat (one-time only). We strongly recommend travel insurance.'
            },
        ]
    },
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filteredCategories = faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(
            faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">FAQ</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-12">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#222] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        Frequently Asked Questions
                    </h1>
                    <p className="text-[#777] mb-6">
                        Find answers to common questions about our products, rituals, and services.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions..."
                            className="w-full pl-12 pr-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)] bg-white"
                        />
                    </div>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-3xl mx-auto px-4">
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[#777]">No questions found matching your search.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredCategories.map((category) => (
                                <div key={category.title}>
                                    <h2 className="text-xl font-semibold text-[#222] mb-4 pb-2 border-b border-[#eee]" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {category.title}
                                    </h2>
                                    <div className="space-y-3">
                                        {category.faqs.map((faq, index) => {
                                            const itemId = `${category.title}-${index}`;
                                            const isOpen = openItems.includes(itemId);

                                            return (
                                                <div
                                                    key={itemId}
                                                    className="border border-[#eee] bg-white"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(itemId)}
                                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f9f9f9] transition-colors"
                                                    >
                                                        <span className="font-medium text-[#222] pr-4">{faq.question}</span>
                                                        <ChevronDown
                                                            size={20}
                                                            className={`text-[#999] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>
                                                    {isOpen && (
                                                        <div className="px-4 pb-4 text-[#777] leading-relaxed border-t border-[#eee] pt-4">
                                                            {faq.answer}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Still Have Questions */}
                    <div className="mt-12 p-8 bg-[#f5f2f2] text-center">
                        <h3 className="text-xl font-semibold text-[#222] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                            Still Have Questions?
                        </h3>
                        <p className="text-[#777] mb-6">
                            Our team is here to help you on your wellness journey.
                        </p>
                        <Link href="/contact" className="btn-solid">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
