'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppURL, whatsAppMessages } from '@/lib/whatsapp';

export default function WhatsAppWidget() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Get WhatsApp number from environment variable (you'll need to add this)
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''; // Add your number here

    useEffect(() => {
        // Show widget on scroll
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleChatClick = (messageType: keyof typeof whatsAppMessages = 'general') => {
        const message = typeof whatsAppMessages[messageType] === 'function'
            ? (whatsAppMessages[messageType] as Function)('')
            : whatsAppMessages[messageType];

        const url = getWhatsAppURL(whatsappNumber, message);
        window.open(url, '_blank');
    };

    if (!whatsappNumber) return null; // Don't show if no number configured

    return (
        <div
            className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                }`}
        >
            {/* Expanded Chat Card */}
            {isExpanded && (
                <div className="mb-4 bg-white rounded-2xl shadow-2xl p-5 w-72 animate-fadeInUp">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-[#222]">Vishwa Wellness</h4>
                                <p className="text-[10px] text-[#25D366] flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-[#999] hover:text-[#222] transition-colors"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Greeting Message */}
                    <div className="bg-[#f9f9f9] rounded-lg p-3 mb-4">
                        <p className="text-xs text-[#444] leading-relaxed">
                            👋 Hi there! How can we help you today?
                        </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="space-y-2">
                        <button
                            onClick={() => handleChatClick('general')}
                            className="w-full text-left px-4 py-2.5 bg-white border border-[#eee] rounded-lg hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors text-xs font-medium text-[#333]"
                        >
                            💬 General Inquiry
                        </button>
                        <button
                            onClick={() => handleChatClick('retreat')}
                            className="w-full text-left px-4 py-2.5 bg-white border border-[#eee] rounded-lg hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors text-xs font-medium text-[#333]"
                        >
                            🧘 Agnihotra Wellness Retreats
                        </button>
                        <button
                            onClick={() => handleChatClick('consultation')}
                            className="w-full text-left px-4 py-2.5 bg-white border border-[#eee] rounded-lg hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors text-xs font-medium text-[#333]"
                        >
                            📅 Book Consultation
                        </button>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-[9px] text-[#999] mt-3 text-center">
                        We typically reply within an hour
                    </p>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Chat on WhatsApp"
            >
                {isExpanded ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                )}
            </button>
        </div>
    );
}
