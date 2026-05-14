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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-56 lg:border-r lg:border-charcoal-100 lg:bg-white z-20">
        {/* Wordmark */}
        <div className="flex h-14 items-center px-5 border-b border-charcoal-100 shrink-0">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight text-charcoal-900"
          >
            Pulse
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-sage-light text-sage"
                    : "text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-charcoal-100">
          <p className="text-[10px] text-charcoal-300">
            ADHD companion
          </p>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 border-t border-charcoal-100 bg-white/90 backdrop-blur-xl safe-bottom">
        <div className="flex items-center justify-around h-14 px-2">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors duration-200 ${
                  active
                    ? "text-sage"
                    : "text-charcoal-400 hover:text-charcoal-700"
                }`}
              >
                <span className="text-[10px] font-medium leading-none truncate">
                  {link.label}
                </span>
                {active && (
                  <span className="h-1 w-1 rounded-full bg-sage" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
