"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isStuckMode = pathname.startsWith("/stuck/");

  return (
    <div className={`flex min-h-screen ${isStuckMode ? "bg-depth" : "bg-warm-paper"}`}>
      <Sidebar dark={isStuckMode} />
      <main className={`flex-1 lg:pl-56 ${isStuckMode ? "" : "pb-16 lg:pb-0"}`}>
        <div className={isStuckMode ? "min-h-screen" : "mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-10"}>
          {children}
        </div>
      </main>
    </div>
  );
}
