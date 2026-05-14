"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="block">
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>
      <input
        className={`mt-1.5 block w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors duration-200 focus:border-emerald-500/40 focus:bg-slate-900 focus:outline-none focus:ring-0 ${
          error ? "border-rose-500/40" : "border-slate-800/60"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
