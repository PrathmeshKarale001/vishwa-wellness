"use client";

import { motion } from "motion/react";
import {
    Shield,
    Truck,
    PhoneCall,
    RefreshCw,
    Award,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}

function TrustBadge({ icon, title, subtitle }: TrustBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100"
        >
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-stone-900">{title}</p>
                {subtitle && (
                    <p className="text-xs text-stone-500">{subtitle}</p>
                )}
            </div>
        </motion.div>
    );
}

/**
 * Trust Badges for Product Page
 * Shows security and service guarantees near the buy button
 */
export function ProductTrustBadges({ className }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
            className={cn("space-y-2", className)}
        >
            <TrustBadge
                icon={<Shield className="w-5 h-5" />}
                title="100% Authentic"
                subtitle="Genuine Ayurvedic products"
            />
            <TrustBadge
                icon={<Truck className="w-5 h-5" />}
                title="Free Shipping"
                subtitle="On orders above ₹499"
            />
            <TrustBadge
                icon={<RefreshCw className="w-5 h-5" />}
                title="Easy Returns"
                subtitle="7-day return policy"
            />
        </motion.div>
    );
}

/**
 * Compact Trust Badges
 * Used in checkout and cart pages
 */
export function CompactTrustBadges({ className }: { className?: string }) {
    const badges = [
        { icon: <Lock className="w-4 h-4" />, label: "Secure Payment" },
        { icon: <Shield className="w-4 h-4" />, label: "100% Authentic" },
        { icon: <Award className="w-4 h-4" />, label: "Quality Tested" },
    ];

    return (
        <div className={cn("flex items-center justify-center gap-4 py-4", className)}>
            {badges.map((badge, i) => (
                <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-1.5 text-stone-500"
                >
                    <span className="text-green-600">{badge.icon}</span>
                    <span className="text-xs font-medium">{badge.label}</span>
                </motion.div>
            ))}
        </div>
    );
}

/**
 * Payment Trust Badges
 * Shows accepted payment methods
 */
export function PaymentBadges({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2 flex-wrap", className)}>
            <span className="text-xs text-stone-500">Secure payments via:</span>
            <div className="flex gap-2">
                {["UPI", "Cards", "Net Banking", "Wallets"].map((method) => (
                    <span
                        key={method}
                        className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded"
                    >
                        {method}
                    </span>
                ))}
            </div>
        </div>
    );
}

/**
 * Contact Support Badge
 * Quick help option
 */
export function SupportBadge({ className }: { className?: string }) {
    return (
        <motion.a
            href="tel:+917447489101"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 text-stone-700 hover:shadow-sm transition-shadow",
                className
            )}
        >
            <PhoneCall className="w-5 h-5 text-green-600" />
            <div>
                <p className="text-sm font-medium">Need help?</p>
                <p className="text-xs text-stone-500">Call us: +91 74474 89101</p>
            </div>
        </motion.a>
    );
}
