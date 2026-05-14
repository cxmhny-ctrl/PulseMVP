"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PulseOrb from "./PulseOrb";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks/new", label: "New Task" },
  { href: "/summary", label: "Summary" },
  { href: "/interventions", label: "History" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();

  const bgClass = dark ? "bg-depth/95 backdrop-blur-sm" : "bg-white";
  const borderClass = dark ? "border-depth-border" : "border-charcoal-100";
  const brandText = dark ? "text-gray-200" : "text-charcoal-900";
  const activeClass = dark
    ? "bg-sage/15 text-sage"
    : "bg-sage-light text-sage";
  const inactiveClass = dark
    ? "text-gray-400 hover:text-gray-200 hover:bg-white/5"
    : "text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100/40";
  const navPadding = dark ? "py-6" : "py-5";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-r ${borderClass} ${bgClass} z-20`}>
        {/* Brand area */}
        <div className={`flex items-center gap-3 h-14 px-5 border-b ${borderClass} shrink-0`}>
          <PulseOrb size="sm" depth={dark} />
          <Link href="/dashboard" className={`text-sm font-semibold tracking-tight ${brandText}`}>
            Pulse
          </Link>
        </div>

        {/* Nav links */}
        <nav className={`flex-1 flex flex-col gap-0.5 px-3 ${navPadding}`}>
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active ? activeClass : inactiveClass
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Pulse status module - with safe bottom padding */}
        <div className={`shrink-0 px-4 py-3 pb-6 border-t ${borderClass}`}>
          <div className={`flex items-center gap-2 ${dark ? "text-gray-400" : "text-charcoal-500"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-sage/60" : "bg-sage"} animate-breathe`} />
            <span className="text-[10px] font-medium uppercase tracking-[0.15em]">Active</span>
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className={`lg:hidden fixed bottom-0 inset-x-0 z-20 border-t ${borderClass} ${dark ? "bg-depth/95" : "bg-white/90"} backdrop-blur-xl`}>
        <div className="flex items-center justify-around h-14 px-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors duration-200 ${
                  active
                    ? "text-sage"
                    : dark ? "text-gray-500 hover:text-gray-300" : "text-charcoal-400 hover:text-charcoal-700"
                }`}
              >
                <span className="text-[10px] font-medium leading-none truncate">{link.label}</span>
                {active && <span className="h-1 w-1 rounded-full bg-sage" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
