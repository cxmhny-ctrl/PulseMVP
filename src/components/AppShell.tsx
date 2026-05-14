import type { ReactNode } from "react";
import Nav from "./Nav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,theme(colors.emerald.500/0.08),transparent_55%)]" />
      <div className="pointer-events-none fixed bottom-0 inset-x-0 h-64 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,theme(colors.emerald.500/0.04),transparent_70%)]" />
      <Nav />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">{children}</main>
    </div>
  );
}
