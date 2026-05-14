import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-800/60 bg-slate-900/80 backdrop-blur-sm p-5 shadow-[inset_0_1px_0_theme(colors.white/0.02)] ${className}`}
    >
      {children}
    </div>
  );
}
