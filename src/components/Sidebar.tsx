"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard",     label: "Dashboard",  abbr: "Dash"    },
  { href: "/tasks/new",     label: "New Task",    abbr: "New"     },
  { href: "/summary",       label: "Summary",     abbr: "Sum"     },
  { href: "/interventions", label: "History",     abbr: "Hist"    },
  { href: "/settings",      label: "Settings",    abbr: "Set"     },
];

export default function Sidebar({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();

  const bg     = dark ? "bg-depth"      : "bg-surface";
  const border = dark ? "border-depth-border" : "border-border";
  const brand  = dark ? "text-white/90" : "text-foreground";

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────── */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-56 lg:border-r ${border} ${bg} z-20 transition-colors duration-300`}
      >
        {/* Brand */}
        <div className={`flex items-center gap-2.5 h-14 px-5 border-b ${border} shrink-0`}>
          {/* Pulse concentric-ring mark */}
          <span className="relative flex h-6 w-6 items-center justify-center shrink-0" aria-hidden>
            <span className={`absolute inset-0 rounded-full border ${dark ? "border-sage/40" : "border-sage/30"}`} />
            <span className={`absolute inset-[4px] rounded-full border ${dark ? "border-sage/60" : "border-sage/50"}`} />
            <span className="h-1.5 w-1.5 rounded-full bg-sage animate-breathe" />
          </span>
          <Link href="/dashboard" className={`text-sm font-semibold tracking-tight ${brand}`}>
            Pulse
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 py-5">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                  ${active
                    ? dark
                      ? "bg-sage/15 text-sage"
                      : "bg-sage-light text-sage"
                    : dark
                      ? "text-white/40 hover:text-white/80 hover:bg-white/5"
                      : "text-muted hover:text-foreground hover:bg-border-subtle/60"
                  }`}
              >
                {/* Active indicator bar */}
                <span
                  className={`mr-3 h-4 w-0.5 rounded-full transition-all duration-150
                    ${active ? "bg-sage opacity-100" : "opacity-0"}`}
                  aria-hidden
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer pulse indicator */}
        <div className={`shrink-0 px-5 py-4 pb-6 border-t ${border}`}>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sage animate-breathe" aria-hidden />
            <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/30" : "text-muted"}`}>
              Active
            </span>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom bar ─────────────────────────────── */}
      <nav
        className={`lg:hidden fixed bottom-0 inset-x-0 z-20 border-t ${border} ${dark ? "bg-depth/95" : "bg-surface/95"} backdrop-blur-xl`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-14 px-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 min-w-0 px-2 py-1 rounded-lg transition-colors duration-150
                  ${active
                    ? "text-sage"
                    : dark ? "text-white/35 hover:text-white/65" : "text-muted hover:text-foreground"
                  }`}
              >
                <span className="text-[10px] font-semibold leading-none truncate">{link.abbr}</span>
                {active && (
                  <span className="h-1 w-1 rounded-full bg-sage" aria-hidden />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
