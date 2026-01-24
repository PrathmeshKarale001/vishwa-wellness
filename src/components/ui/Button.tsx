"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-stone-900 text-white hover:bg-stone-800 focus-visible:ring-stone-900",
                primary:
                    "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-600",
                secondary:
                    "bg-stone-100 text-stone-900 hover:bg-stone-200 focus-visible:ring-stone-300",
                outline:
                    "border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white",
                ghost:
                    "text-stone-900 hover:bg-stone-100 focus-visible:ring-stone-300",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
                link:
                    "text-stone-900 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                xl: "h-14 px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// Animation variants for micro-interactions
const buttonMotionVariants = {
    tap: { scale: 0.97 },
    hover: { scale: 1.02 },
};

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, 'children'>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            loading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <motion.button
                whileTap={buttonMotionVariants.tap}
                whileHover={buttonMotionVariants.hover}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : leftIcon ? (
                    <span className="mr-2">{leftIcon}</span>
                ) : null}
                {children}
                {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
