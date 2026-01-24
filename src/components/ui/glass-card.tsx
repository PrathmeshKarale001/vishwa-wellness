"use client";

import { motion, HTMLMotionProps } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "frosted" | "solid";
    hover?: boolean;
}

/**
 * Glassmorphism Card Component
 * Modern frosted glass effect for cards and containers
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, variant = "default", hover = false, ...props }, ref) => {
        const variants = {
            default: "bg-white/70 backdrop-blur-md border border-white/20 shadow-lg",
            frosted: "bg-white/40 backdrop-blur-xl border border-white/30 shadow-xl",
            solid: "bg-white border border-stone-200 shadow-sm",
        };

        return (
            <motion.div
                ref={ref}
                whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                    "rounded-2xl",
                    variants[variant],
                    hover && "cursor-pointer transition-shadow hover:shadow-xl",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
GlassCard.displayName = "GlassCard";

/**
 * Animated Feature Card
 * For displaying features or benefits with icons
 */
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    className?: string;
}

function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "p-6 rounded-2xl bg-gradient-to-br from-white to-stone-50 border border-stone-100 shadow-sm",
                className
            )}
        >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
            )}
        </motion.div>
    );
}

/**
 * Animated Stats Card
 * For displaying metrics with animations
 */
interface StatsCardProps {
    value: string | number;
    label: string;
    trend?: {
        value: number;
        positive: boolean;
    };
    className?: string;
}

function StatsCard({ value, label, trend, className }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
                "p-6 rounded-2xl bg-white border border-stone-100 shadow-sm",
                className
            )}
        >
            <p className="text-3xl font-bold text-stone-900 mb-1">{value}</p>
            <p className="text-sm text-stone-500">{label}</p>
            {trend && (
                <div
                    className={cn(
                        "mt-2 inline-flex items-center text-xs font-medium",
                        trend.positive ? "text-green-600" : "text-red-600"
                    )}
                >
                    <span>{trend.positive ? "↑" : "↓"}</span>
                    <span className="ml-1">{Math.abs(trend.value)}%</span>
                </div>
            )}
        </motion.div>
    );
}

/**
 * Animated List Item
 * For staggered list animations
 */
interface AnimatedListItemProps {
    children: React.ReactNode;
    index?: number;
    className?: string;
}

function AnimatedListItem({ children, index = 0, className }: AnimatedListItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export { GlassCard, FeatureCard, StatsCard, AnimatedListItem };
