export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-12 h-16">
        {/* Wordmark + concentric ring mark */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-6 w-6 items-center justify-center shrink-0" aria-hidden>
            <span className="absolute inset-0 rounded-full border border-sage/25" />
            <span className="absolute inset-[4px] rounded-full border border-sage/40" />
            <span className="h-[7px] w-[7px] rounded-full bg-sage animate-breathe" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">Pulse</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted" aria-label="Site navigation">
          <a href="/dashboard" className="hover:text-foreground transition-colors duration-150">Dashboard</a>
          <a href="/summary"   className="hover:text-foreground transition-colors duration-150">Summary</a>
        </nav>

        <a
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-5 h-9 text-xs font-semibold text-background transition-all duration-200 hover:opacity-80 active:scale-[0.97]"
        >
          Get started
        </a>
      </header>

      {/* ── Hero — full-bleed split layout ───────────────────── */}
      <section className="relative z-10 px-6 lg:px-12 pt-12 lg:pt-20 pb-0">

        {/* Large dividing rule */}
        <div className="w-full h-px bg-border mb-8" aria-hidden />

        {/* Two-column headline grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-y-8 gap-x-12 items-end">

          {/* Left — giant serif headline */}
          <h1 className="font-serif text-[clamp(3.5rem,10vw,8.5rem)] font-bold leading-[0.95] tracking-tight text-foreground text-balance">
            Start&nbsp;when<br />
            you&rsquo;re&nbsp;stuck.
          </h1>

          {/* Right — descriptor column, anchored to baseline */}
          <div className="flex flex-col gap-5 lg:max-w-[240px] pb-1">
            <p className="eyebrow">For ADHD minds</p>
            <p className="text-sm text-muted-strong leading-relaxed text-pretty">
              Pulse gives you the next tiny step. No planning spiral. No shame. Just a quiet nudge from stuck to started.
            </p>
          </div>
        </div>

        {/* Large dividing rule */}
        <div className="w-full h-px bg-border mt-8" aria-hidden />
      </section>

      {/* ── Pulse visual + three-step story ──────────────────── */}
      <section
        aria-label="How Pulse works"
        className="relative z-10 px-6 lg:px-12 mt-12 lg:mt-16"
      >
        {/*
          One unified container: the three steps live *inside* a single
          large panel, connected by a shared horizontal thread.
          The Pulse orb sits in the centre as the visual fulcrum.
        */}
        <div className="relative w-full rounded-3xl border border-border bg-surface overflow-hidden">

          {/* ── Ambient orb — absolute centred, behind content ── */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            {/* Outermost slow ring */}
            <span className="absolute w-[520px] h-[520px] rounded-full border border-sage/8 animate-orb-expand-slow" />
            {/* Mid ring */}
            <span className="absolute w-[380px] h-[380px] rounded-full border border-sage/10 animate-orb-expand" />
            {/* Inner static ring */}
            <span className="absolute w-[240px] h-[240px] rounded-full border border-sage/14" />
            {/* Core dot */}
            <span className="absolute w-[10px] h-[10px] rounded-full bg-sage animate-breathe" />
          </div>

          {/* ── Three-step content row ─────────────────────────── */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">

            {/* 01 Stuck */}
            <div className="flex flex-col justify-between gap-10 p-8 lg:p-10">
              <div>
                <p className="eyebrow text-coral/80 mb-5">01 — Stuck</p>
                <p className="font-serif text-2xl lg:text-3xl font-bold leading-snug text-foreground">
                  Something feels impossible to&nbsp;start.
                </p>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                That freeze is real. It&rsquo;s not a character flaw — it&rsquo;s how ADHD brains work under load.
              </p>
            </div>

            {/* 02 Tiny Step — the hero step, visually elevated */}
            <div className="relative flex flex-col justify-between gap-10 p-8 lg:p-10 bg-sage/[0.045]">
              {/* Top accent line */}
              <span
                className="absolute top-0 left-8 lg:left-10 right-8 lg:right-10 h-[2px] bg-sage/30 rounded-full"
                aria-hidden
              />
              <div>
                <p className="eyebrow text-sage mb-5">02 — Tiny step</p>
                <p className="font-serif text-2xl lg:text-3xl font-bold leading-snug text-foreground">
                  Pulse finds the one thing you can do&nbsp;right&nbsp;now.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-sage/30 animate-pulse-ring" />
                  <span className="h-3 w-3 rounded-full bg-sage animate-breathe" />
                </span>
                <span className="text-xs text-sage/70">AI-generated, human-paced</span>
              </div>
            </div>

            {/* 03 Started */}
            <div className="flex flex-col justify-between gap-10 p-8 lg:p-10">
              <div>
                <p className="eyebrow text-muted mb-5">03 — Started</p>
                <p className="font-serif text-2xl lg:text-3xl font-bold leading-snug text-foreground">
                  You&rsquo;re doing it. That&rsquo;s&nbsp;enough.
                </p>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                No productivity theatre. Come back whenever you need the next step.
              </p>
            </div>
          </div>

          {/* ── CTA bar — premium inset, lives inside the panel ── */}
          <div className="relative border-t border-border px-8 lg:px-10 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            {/* Left label */}
            <div className="flex items-center gap-4">
              {/* Concentric ring lockup — the Pulse motif in miniature */}
              <span className="relative flex h-9 w-9 items-center justify-center shrink-0" aria-hidden>
                <span className="absolute inset-0 rounded-full border border-sage/20" />
                <span className="absolute inset-[5px] rounded-full border border-sage/35" />
                <span className="h-[9px] w-[9px] rounded-full bg-sage animate-breathe" />
              </span>
              <span className="font-serif text-lg font-bold text-foreground leading-tight">
                Ready to get unstuck?
              </span>
            </div>

            {/* Right CTA */}
            <div className="flex items-center gap-4 shrink-0">
              <a
                href="/onboarding"
                className="inline-flex items-center justify-center rounded-full bg-sage h-11 px-7 text-sm font-semibold text-white shadow-[0_2px_20px_rgba(74,155,127,0.30)] transition-all duration-200 hover:bg-sage-hover active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-sage/50"
              >
                Set up Pulse
              </a>
              <a
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-strong hover:text-foreground transition-colors duration-150"
              >
                Dashboard <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee — the rhythm ticker ──────────────────────── */}
      <section aria-hidden className="relative z-10 mt-10 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee gap-0">
          {/* Duplicate the string so the loop is seamless */}
          {[0, 1].map((i) => (
            <span
              key={i}
              className="inline-flex items-baseline gap-0 font-serif text-[clamp(2.8rem,7vw,6rem)] font-bold tracking-tight text-foreground/[0.055] leading-none pr-0"
            >
              {["Stuck", "→", "Step", "→", "Started"].map((word, j) => (
                <span
                  key={j}
                  className="px-[0.25em]"
                  style={{ color: word === "→" ? "rgba(74,155,127,0.12)" : undefined }}
                >
                  {word}
                </span>
              ))}
              {["Stuck", "→", "Step", "→", "Started"].map((word, j) => (
                <span
                  key={`b-${j}`}
                  className="px-[0.25em]"
                  style={{ color: word === "→" ? "rgba(74,155,127,0.12)" : undefined }}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <footer className="relative z-10 px-6 lg:px-12 py-10">
        <p className="text-[10px] text-muted max-w-xs leading-relaxed">
          Not a medical device. Does not diagnose or treat any condition.
        </p>
      </footer>

    </main>
  );
}
