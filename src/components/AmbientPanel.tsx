import type { ReactNode } from "react";

interface AmbientPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function AmbientPanel({ title, subtitle, children, className = "" }: AmbientPanelProps) {
  return (
    <div className={`surface-warm ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-charcoal-900">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-charcoal-500">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
