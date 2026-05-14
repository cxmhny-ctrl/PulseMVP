export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-center">
      {/* Ambient pulse glow behind hero */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[500px] w-[500px] items-center justify-center">
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/[0.04]" style={{ animationDelay: "0s" }} />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/[0.03]" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/[0.02]" style={{ animationDelay: "1.2s" }} />
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

      {/* Stuck-to-action loop visual */}
      <div className="relative z-10 mt-12 flex items-center gap-0">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-[inset_0_1px_0_theme(colors.white/0.03)]">
            <span className="text-lg font-semibold text-rose-400/70">Stuck</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            You are here
          </span>
        </div>

        <div className="mx-3 flex flex-col items-center gap-1">
          <span className="flex h-px w-16 bg-gradient-to-r from-slate-700/40 via-emerald-500/30 to-slate-700/40" />
          <span className="text-[10px] text-slate-600">Pulse</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-[inset_0_1px_0_theme(colors.white/0.03)]">
            <span className="text-lg font-semibold text-slate-400">Step</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Tiny step
          </span>
        </div>

        <div className="mx-3 flex flex-col items-center gap-1">
          <span className="flex h-px w-16 bg-gradient-to-r from-slate-700/40 via-emerald-500/30 to-slate-700/40" />
          <span className="text-[10px] text-slate-600">Start</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-950/50 shadow-[inset_0_1px_0_theme(colors.emerald.400/0.1)]">
            <span className="text-lg font-semibold text-emerald-400/80">Done</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Started
          </span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="relative z-10 mt-12 flex gap-4">
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
