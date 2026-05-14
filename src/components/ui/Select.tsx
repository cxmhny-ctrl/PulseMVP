"use client";

import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="block">
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>
      <select
        className={`mt-1.5 block w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 transition-colors duration-200 focus:border-emerald-500/40 focus:bg-slate-900 focus:outline-none focus:ring-0 ${
          error ? "border-rose-500/40" : "border-slate-800/60"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
