import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-warm-paper">
      <Sidebar />
      {/* Desktop: offset for sidebar. Mobile: offset for bottom nav */}
      <main className="flex-1 lg:pl-56 pb-16 lg:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
