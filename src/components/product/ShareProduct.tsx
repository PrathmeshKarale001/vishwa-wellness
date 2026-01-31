'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, Check, Mail } from 'lucide-react';

interface ShareProductProps {
    productTitle: string;
    productUrl?: string;
}

export default function ShareProduct({ productTitle, productUrl }: ShareProductProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [copied, setCopied] = useState(false);

    const url = productUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const text = `Check out ${productTitle} on Vishwa Wellness!`;

    const shareLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'hover:bg-blue-600 hover:text-white'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            color: 'hover:bg-sky-500 hover:text-white'
        },
        {
            name: 'Email',
            icon: Mail,
            url: `mailto:?subject=${encodeURIComponent(productTitle)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
            color: 'hover:bg-gray-700 hover:text-white'
        }
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
                aria-label="Share product"
            >
                <Share2 className="w-5 h-5 text-gray-600" />
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[180px] animate-fadeIn">
                        <p className="text-xs text-gray-500 px-3 py-2 font-medium">Share via</p>

                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 transition-all ${link.color}`}
                                onClick={() => setShowDropdown(false)}
                            >
                                <link.icon className="w-4 h-4" />
                                <span className="text-sm">{link.name}</span>
                            </a>
                        ))}

                        <hr className="my-2 border-gray-100" />

                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all w-full"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="w-4 h-4" />
                                    <span className="text-sm">Copy Link</span>
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
