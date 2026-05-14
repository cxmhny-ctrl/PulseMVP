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
    <div className={`flex min-h-screen ${isStuckMode ? "bg-depth" : "bg-background"} transition-colors duration-500`}>
      <Sidebar dark={isStuckMode} />

      <main
        className={`flex-1 lg:pl-56 ${isStuckMode ? "" : "pb-16 lg:pb-0"}`}
        id="main-content"
      >
        {isStuckMode ? (
          <div className="min-h-screen">{children}</div>
        ) : (
          <div className="mx-auto max-w-5xl px-5 py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
