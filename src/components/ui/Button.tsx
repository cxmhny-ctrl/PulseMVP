"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-sage text-white shadow-[inset_0_1px_0_theme(colors.sage.hover)] hover:bg-sage-hover active:bg-sage/90 focus-visible:ring-sage/40",
  secondary:
    "border border-charcoal-100 bg-white text-charcoal-700 hover:bg-charcoal-100/40 hover:text-charcoal-900 focus-visible:ring-charcoal-300/40",
  ghost:
    "text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100/40 focus-visible:ring-charcoal-300/40",
  danger:
    "bg-coral text-white shadow-[inset_0_1px_0_theme(colors.coral.hover)] hover:bg-coral-hover active:bg-coral/90 focus-visible:ring-coral/40",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl h-10 px-5 text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-paper disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
