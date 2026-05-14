import type { ReactNode } from "react";
import Nav from "./Nav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
    </div>
  );
}
