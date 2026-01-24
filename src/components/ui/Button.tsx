import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase tracking-wider";

    const variants = {
        primary: "bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary)] hover:bg-transparent hover:text-[var(--color-primary)] focus:ring-[var(--color-primary)]",
        secondary: "bg-[var(--color-dark)] text-white border-2 border-[var(--color-dark)] hover:bg-transparent hover:text-[var(--color-dark)] focus:ring-[var(--color-dark)]",
        outline: "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:ring-[var(--color-primary)]",
        ghost: "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 focus:ring-[var(--color-primary)]",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
