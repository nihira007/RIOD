import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-brand text-brand-foreground shadow-seal hover:brightness-105 active:brightness-95",
    secondary:
        "bg-surface-elevated text-foreground border border-border hover:border-brand/50 hover:bg-surface",
    outline:
        "bg-transparent text-foreground border border-border hover:bg-surface",
    ghost: "bg-transparent text-foreground hover:bg-surface",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3.5 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = "primary", size = "md", className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export default Button;
