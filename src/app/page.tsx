export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* ── Nav bar ───────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-12 h-16">
        <div className="flex items-center gap-2.5">
          {/* Pulse mark: concentric rings */}
          <span className="relative flex h-7 w-7 items-center justify-center" aria-hidden>
            <span className="absolute inset-0 rounded-full border border-sage/30" />
            <span className="absolute inset-[5px] rounded-full border border-sage/50" />
            <span className="h-2 w-2 rounded-full bg-sage animate-breathe" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">Pulse</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted">
          <a href="/dashboard" className="hover:text-foreground transition-colors duration-150">Dashboard</a>
          <a href="/summary" className="hover:text-foreground transition-colors duration-150">Summary</a>
        </nav>

        <a
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-5 h-9 text-xs font-semibold text-background transition-all duration-200 hover:bg-ink/80 active:scale-[0.97]"
        >
          Get started
        </a>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-start px-6 lg:px-12 pt-16 lg:pt-24 pb-10">
        {/* Eyebrow */}
        <p className="eyebrow mb-6">For minds that get stuck</p>

        {/* Giant headline — editorial, left-aligned */}
        <h1 className="headline-xl max-w-3xl">
          Start when<br className="hidden sm:block" /> you&rsquo;re&nbsp;stuck.
        </h1>

        <p className="mt-6 text-base lg:text-lg text-muted-strong leading-relaxed max-w-md text-pretty">
          Pulse gives you the next tiny step. No planning spiral. No shame. Just a quiet nudge from stuck to started.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <a
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-sage h-12 px-7 text-sm font-semibold text-white shadow-[0_2px_16px_rgba(74,155,127,0.28)] transition-all duration-200 hover:bg-sage-hover active:scale-[0.97]"
          >
            Set up Pulse
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-strong hover:text-foreground transition-colors duration-150"
          >
            Dashboard <span aria-hidden>→</span>
          </a>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-[10px] text-muted max-w-xs leading-relaxed">
          Not a medical device. Does not diagnose or treat any condition.
        </p>
      </section>

      {/* ── Product motif ─────────────────────────────────── */}
      <section className="relative z-10 px-6 lg:px-12 mt-4 lg:mt-6 pb-24">
        {/* Large editorial strip: the core loop visualised as a horizontal rail */}
        <div className="relative flex flex-col md:flex-row items-stretch gap-px max-w-5xl">

          {/* Stuck */}
          <div className="group flex-1 flex flex-col justify-between rounded-3xl border border-border bg-surface-raised p-7 lg:p-9 transition-all duration-300 hover:border-coral/30">
            <div>
              <p className="eyebrow text-coral/70 mb-4">01 — Stuck</p>
              <p className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                Something feels impossible to start.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-coral" />
              <span className="text-xs text-muted">That&rsquo;s okay. It&rsquo;s not you.</span>
            </div>
          </div>

          {/* Connector arrow */}
          <div className="hidden md:flex items-center justify-center px-3 text-muted/40 text-xl select-none" aria-hidden>
            →
          </div>

          {/* Tiny Step — hero panel */}
          <div className="flex-1 flex flex-col justify-between rounded-3xl border-2 border-sage/35 bg-sage-light/30 p-7 lg:p-9 transition-all duration-300 hover:border-sage/55">
            <div>
              <p className="eyebrow text-sage mb-4">02 — Tiny step</p>
              <p className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                Pulse breaks it down to one thing.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inset-0 rounded-full bg-sage/30 animate-pulse-ring" />
                <span className="h-3 w-3 rounded-full bg-sage animate-breathe" />
              </span>
              <span className="text-xs text-sage/70">AI-generated, human-paced</span>
            </div>
          </div>

          {/* Connector arrow */}
          <div className="hidden md:flex items-center justify-center px-3 text-muted/40 text-xl select-none" aria-hidden>
            →
          </div>

          {/* Started */}
          <div className="group flex-1 flex flex-col justify-between rounded-3xl border border-border bg-surface-raised p-7 lg:p-9 transition-all duration-300 hover:border-sage/30">
            <div>
              <p className="eyebrow text-muted mb-4">03 — Started</p>
              <p className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                You&rsquo;re doing it.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-sage/60" />
              <span className="text-xs text-muted">No pressure. Come back when you need.</span>
            </div>
          </div>
        </div>

        {/* Bottom tagline — editorial full-width text */}
        <p className="mt-16 lg:mt-20 font-serif text-[clamp(2rem,6vw,5rem)] font-bold leading-none tracking-tight text-foreground/8 select-none whitespace-nowrap overflow-hidden">
          Stuck&nbsp;&nbsp;→&nbsp;&nbsp;Step&nbsp;&nbsp;→&nbsp;&nbsp;Started&nbsp;&nbsp;—&nbsp;&nbsp;Stuck&nbsp;&nbsp;→&nbsp;&nbsp;Step&nbsp;&nbsp;→&nbsp;&nbsp;Started
        </p>
      </section>
    </main>
  );
}
