import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
    children: ReactNode;
    className?: string;
    background?: "cream" | "white" | "beige" | "navy";
    id?: string;
}

export function Section({
    children,
    className,
    background = "cream",
    id,
}: SectionProps) {
    const backgrounds = {
        cream: "bg-[var(--color-cream)] text-[var(--color-navy)]",
        white: "bg-white text-[var(--color-navy)]",
        beige: "bg-[var(--color-beige)] text-[var(--color-navy)]",
        navy: "bg-[var(--color-navy)] text-white",
    };

    return (
        <section
            id={id}
            className={cn(
                "section-padding",
                backgrounds[background],
                className
            )}
        >
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </section>
    );
}

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center" | "right";
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
}

export function SectionHeading({
    title,
    subtitle,
    align = "center",
    className,
    titleClassName,
    subtitleClassName,
}: SectionHeadingProps) {
    const alignments = {
        left: "text-left",
        center: "text-center mx-auto",
        right: "text-right ml-auto",
    };

    return (
        <div className={cn("max-w-3xl mb-12", alignments[align], className)}>
            <h2 className={cn(
                "font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-balance",
                titleClassName
            )}>
                {title}
            </h2>
            {subtitle && (
                <p className={cn(
                    "text-lg leading-relaxed",
                    subtitleClassName
                )}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

interface SacredDividerProps {
    text?: string;
    className?: string;
}

export function SacredDivider({ text, className }: SacredDividerProps) {
    if (text) {
        return (
            <div className={cn("sacred-divider text-[var(--color-gold)] text-sm tracking-widest uppercase", className)}>
                {text}
            </div>
        );
    }

    return (
        <div className={cn("w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent", className)} />
    );
}
