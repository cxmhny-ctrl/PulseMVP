import type { ReactNode } from "react";
import Nav from "./Nav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
