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
      <span className="text-sm font-medium text-charcoal-700">
        {label}
      </span>
      <select
        className={`mt-1.5 block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-charcoal-900 transition-colors duration-200 focus:border-sage/40 focus:bg-white focus:outline-none focus:ring-0 ${
          error ? "border-coral/40" : "border-charcoal-100"
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
        <p className="mt-1.5 text-xs text-coral">{error}</p>
      )}
    </div>
  );
}
