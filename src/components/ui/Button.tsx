"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-600 text-white shadow-[inset_0_1px_0_theme(colors.emerald.400/0.3)] hover:bg-emerald-500 active:bg-emerald-700 focus-visible:ring-emerald-500/50",
  secondary:
    "border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-slate-100 focus-visible:ring-slate-500/50",
  ghost:
    "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 focus-visible:ring-slate-500/50",
  danger:
    "bg-rose-600 text-white shadow-[inset_0_1px_0_theme(colors.rose.400/0.3)] hover:bg-rose-500 active:bg-rose-700 focus-visible:ring-rose-500/50",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl h-10 px-5 text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
