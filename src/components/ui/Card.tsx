import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    variant?: "default" | "elevated" | "bordered";
}

export function Card({
    children,
    className,
    hover = true,
    variant = "default",
}: CardProps) {
    const variants = {
        default: "bg-white",
        elevated: "bg-white shadow-xl",
        bordered: "bg-white border-2 border-[var(--color-beige)]",
    };

    return (
        <div
            className={cn(
                "rounded-2xl overflow-hidden",
                variants[variant],
                hover && "card-hover",
                className
            )}
        >
            {children}
        </div>
    );
}

interface CardImageProps {
    src?: string;
    alt: string;
    className?: string;
    aspectRatio?: "square" | "video" | "portrait";
}

export function CardImage({
    src,
    alt,
    className,
    aspectRatio = "video",
}: CardImageProps) {
    const ratios = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
    };

    return (
        <div className={cn("relative overflow-hidden bg-[var(--color-beige)]", ratios[aspectRatio], className)}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-ash)]">
                    <span className="text-sm">Image Placeholder</span>
                </div>
            )}
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
    return (
        <h3 className={cn("font-[family-name:var(--font-playfair)] text-xl font-semibold mb-2", className)}>
            {children}
        </h3>
    );
}

interface CardDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
    return (
        <p className={cn("text-sm leading-relaxed", className)}>
            {children}
        </p>
    );
}
