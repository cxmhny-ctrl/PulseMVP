"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <input
        className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 focus:outline-none ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </label>
  );
}
