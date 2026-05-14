export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center bg-warm-paper overflow-hidden">
      {/* Large ambient field behind right side */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4">
        <div className="h-[800px] w-[800px] rounded-full bg-sage/5 blur-3xl animate-glow" />
        <div className="absolute inset-0 h-[600px] w-[600px] m-auto rounded-full bg-amber/3 blur-2xl animate-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl mx-auto px-6 lg:px-8 items-center gap-12 lg:gap-24">
        {/* Left: copy */}
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.2em] text-amber mb-4 font-medium">
            For ADHD minds
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-900 leading-[1.05]">
            Start when<br />you&rsquo;re stuck
          </h1>
          <p className="mt-5 text-lg lg:text-xl leading-relaxed text-charcoal-700 max-w-md">
            Pulse gives you the next tiny step.<br />No planning. No shame.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-xl bg-sage h-11 px-6 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(93,171,145,0.3)] transition-all duration-200 hover:bg-sage-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-paper"
            >
              Set up Pulse
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-charcoal-100 bg-white h-11 px-6 text-sm font-medium text-charcoal-700 transition-all duration-200 hover:bg-charcoal-100/40 hover:text-charcoal-900 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-paper"
            >
              Dashboard
            </a>
          </div>
          <p className="mt-12 text-xs text-charcoal-500">
            Pulse is not a medical device and does not diagnose or treat any condition.
          </p>
        </div>

        {/* Right: product metaphor - one designed object */}
        <div className="flex-1 hidden lg:flex items-center justify-center">
          {/* Large ambient ring behind full path */}
          <div className="absolute flex items-center justify-center pointer-events-none">
            <div className="h-80 w-80 rounded-full border border-sage/8 bg-sage/2 blur-xl" />
            <div className="absolute h-72 w-72 rounded-full border border-sage/6 bg-transparent" />
          </div>

          {/* Vertical Stuck → Step → Started */}
          <div className="relative flex flex-col items-center gap-0">
            {/* Stuck card */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex h-20 w-56 items-center justify-center rounded-2xl border border-coral/15 bg-coral-light/60 shadow-[0_4px_16px_rgba(212,105,94,0.06),inset_0_1px_0_rgba(212,105,94,0.1)]">
                <span className="text-lg font-semibold text-coral/80">Stuck</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">I can&rsquo;t start</span>
            </div>

            {/* Connector - thicker, more designed */}
            <div className="flex flex-col items-center py-1">
              <div className="h-5 w-[1.5px] bg-gradient-to-b from-coral/25 via-sage/40 to-sage/20 rounded-full" />
              <div className="h-1.5 w-[1.5px] bg-gradient-to-b from-sage/20 to-sage/35 rounded-full" />
            </div>

            {/* Tiny Step card - visual center, slightly highlighted */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex h-20 w-56 items-center justify-center rounded-2xl border-2 border-sage/25 bg-sage-light shadow-[0_4px_20px_rgba(74,155,127,0.08),inset_0_1px_0_rgba(74,155,127,0.12)]">
                <span className="text-lg font-semibold text-sage">Tiny step</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Pulse breaks it down</span>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center py-1">
              <div className="h-5 w-[1.5px] bg-gradient-to-b from-sage/25 via-sage/45 to-sage/25 rounded-full" />
              <div className="h-1.5 w-[1.5px] bg-gradient-to-b from-sage/25 to-sage/40 rounded-full" />
            </div>

            {/* Started card */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative flex h-20 w-56 items-center justify-center rounded-2xl border border-sage/25 bg-sage-light shadow-[0_4px_16px_rgba(74,155,127,0.08),inset_0_1px_0_rgba(74,155,127,0.15)]">
                <span className="text-lg font-semibold text-sage">Started</span>
                <div className="absolute -inset-1 rounded-2xl bg-sage/8 blur-md animate-breathe" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">You&rsquo;re doing it</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
