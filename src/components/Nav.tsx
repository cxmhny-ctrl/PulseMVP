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
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
      <div className="mx-auto flex max-w-2xl items-center gap-0.5 px-4 h-12 overflow-x-auto">
        <Link
          href="/dashboard"
          className="mr-3 text-sm font-semibold text-slate-100 shrink-0 tracking-tight"
        >
          Pulse
        </Link>
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-emerald-950/60 text-emerald-300"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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
