"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks/new", label: "New Task" },
  { href: "/summary", label: "Summary" },
  { href: "/interventions", label: "History" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto flex max-w-3xl items-center gap-1 px-4 h-12 overflow-x-auto">
        <Link
          href="/dashboard"
          className="mr-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0"
        >
          Pulse
        </Link>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                active
                  ? "bg-pulse-50 text-pulse-700 dark:bg-pulse-900 dark:text-pulse-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
