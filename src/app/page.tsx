export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-center">
      {/* Ambient pulse glow behind hero */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[500px] w-[500px] items-center justify-center">
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/[0.06]" style={{ animationDelay: "0s" }} />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/[0.04]" style={{ animationDelay: "0.7s" }} />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/[0.03]" style={{ animationDelay: "1.4s" }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-100">
          Start when you&apos;re stuck
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-300">
          Pulse gives you the next tiny step. No planning. No shame.
        </p>
      </div>

      {/* Stuck-to-action loop */}
      <div className="relative z-10 mt-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">
          How it works
        </p>

        {/* Horizontal flow on desktop, stacked on mobile */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0">
          {/* Step 1: Stuck */}
          <div className="flex flex-col items-center gap-2 sm:flex-1">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/15 bg-rose-950/30 shadow-[inset_0_1px_0_theme(colors.rose.400/0.1)]">
              <span className="text-sm font-semibold text-rose-300/80">
                Stuck
              </span>
              {/* Small pulse accent */}
              <div className="absolute -inset-1 rounded-2xl bg-rose-500/[0.04] blur-md animate-breathe" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
              You are here
            </span>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center sm:flex-1 sm:max-w-16">
            <span className="hidden sm:block h-px w-full bg-gradient-to-r from-rose-500/20 via-emerald-500/30 to-transparent" />
            <span className="sm:hidden h-6 w-px bg-gradient-to-b from-rose-500/20 via-emerald-500/30 to-transparent" />
            <span className="text-[10px] text-slate-700 mt-1 hidden sm:inline">Pulse</span>
          </div>

          {/* Step 2: Tiny step */}
          <div className="flex flex-col items-center gap-2 sm:flex-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-950/30 shadow-[inset_0_1px_0_theme(colors.emerald.400/0.1)]">
              <span className="text-sm font-semibold text-emerald-300/80">
                Step
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
              Next tiny step
            </span>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center sm:flex-1 sm:max-w-16">
            <span className="hidden sm:block h-px w-full bg-gradient-to-r from-emerald-500/20 via-emerald-500/40 to-transparent" />
            <span className="sm:hidden h-6 w-px bg-gradient-to-b from-emerald-500/20 via-emerald-500/40 to-transparent" />
            <span className="text-[10px] text-slate-700 mt-1 hidden sm:inline">Start</span>
          </div>

          {/* Step 3: Started */}
          <div className="flex flex-col items-center gap-2 sm:flex-1">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-950/50 shadow-[inset_0_1px_0_theme(colors.emerald.400/0.15)]">
              <span className="text-sm font-semibold text-emerald-300">
                Done
              </span>
              <div className="absolute -inset-1 rounded-2xl bg-emerald-500/[0.06] blur-md animate-breathe" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
              Started
            </span>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="relative z-10 mt-14 flex gap-4">
        <a
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 h-10 px-5 text-sm font-medium text-white shadow-[inset_0_1px_0_theme(colors.emerald.400/0.3)] transition-all duration-200 hover:bg-emerald-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Set up Pulse
        </a>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 h-10 px-5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Dashboard
        </a>
      </div>

      <p className="relative z-10 mt-16 text-xs text-slate-500">
        Pulse is not a medical device and does not diagnose or treat any
        condition.
      </p>
    </main>
  );
}
