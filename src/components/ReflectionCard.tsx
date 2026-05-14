import type { ReactNode } from "react";

interface ReflectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ReflectionCard({ title, children, className = "" }: ReflectionCardProps) {
  return (
    <div className={`surface-card relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-48 rounded-full bg-sage/4 blur-2xl" />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.15em] text-charcoal-500 mb-4">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}
