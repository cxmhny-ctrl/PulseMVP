"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="block">
      <span className="text-sm font-medium text-charcoal-700">
        {label}
      </span>
      <input
        className={`mt-1.5 block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-charcoal-900 placeholder-charcoal-300 transition-colors duration-200 focus:border-sage/40 focus:bg-white focus:outline-none focus:ring-0 ${
          error ? "border-coral/40" : "border-charcoal-100"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-coral">{error}</p>
      )}
    </div>
  );
}
