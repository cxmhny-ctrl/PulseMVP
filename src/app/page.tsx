export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-warm-paper px-4 text-center">
      {/* Ambient warm glow field */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-sage/6 blur-3xl animate-glow" />
        <div className="absolute h-[400px] w-[400px] rounded-full bg-amber/4 blur-2xl animate-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero text */}
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal-500 mb-4">
          For ADHD minds
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-charcoal-900">
          Start when you&apos;re stuck
        </h1>
        <p className="mt-4 max-w-md mx-auto text-lg leading-relaxed text-charcoal-700">
          Pulse gives you the next tiny step. No planning. No shame.
        </p>
      </div>

      {/* Product metaphor: larger immersive StuckPath */}
      <div className="relative z-10 mt-16">
        {/* Ambient ring field behind the path */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
          <div className="h-72 w-72 rounded-full border border-sage/5 bg-sage/3 blur-xl" />
        </div>

        <div className="relative flex items-center justify-center gap-3 sm:gap-6">
          {/* Step 1: Stuck */}
          <div className="flex flex-col items-center gap-3 w-24 sm:w-28">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-coral/15 bg-coral-light/60 shadow-[inset_0_1px_0_rgba(212,105,94,0.1)]">
              <span className="text-sm font-semibold text-coral/80">Stuck</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-500 h-8 flex items-center text-center leading-tight">
              You are here
            </span>
          </div>

          {/* Connector 1 */}
          <div className="flex items-center justify-center w-12 sm:w-16 shrink-0">
            <div className="h-px w-full bg-gradient-to-r from-coral/20 via-sage/40 to-sage/30" />
          </div>

          {/* Step 2: Tiny step */}
          <div className="flex flex-col items-center gap-3 w-24 sm:w-28">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-sage/20 bg-sage-light shadow-[inset_0_1px_0_rgba(74,155,127,0.1)]">
              <span className="text-sm font-semibold text-sage/80">Step</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-500 h-8 flex items-center text-center leading-tight">
              Next tiny step
            </span>
          </div>

          {/* Connector 2 */}
          <div className="flex items-center justify-center w-12 sm:w-16 shrink-0">
            <div className="h-px w-full bg-gradient-to-r from-sage/30 via-sage/50 to-sage/40" />
          </div>

          {/* Step 3: Started */}
          <div className="flex flex-col items-center gap-3 w-24 sm:w-28">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-sage/25 bg-sage-light shadow-[inset_0_1px_0_rgba(74,155,127,0.15)]">
              <span className="text-sm font-semibold text-sage">Done</span>
              <div className="absolute -inset-1 rounded-2xl bg-sage/5 blur-md animate-breathe" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-500 h-8 flex items-center text-center leading-tight">
              Started
            </span>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="relative z-10 mt-14 flex gap-4">
        <a
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-xl bg-sage h-10 px-5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(93,171,145,0.3)] transition-all duration-200 hover:bg-sage-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-paper"
        >
          Set up Pulse
        </a>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl border border-charcoal-100 bg-white h-10 px-5 text-sm font-medium text-charcoal-700 transition-all duration-200 hover:bg-charcoal-100/40 hover:text-charcoal-900 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-paper"
        >
          Dashboard
        </a>
      </div>

      <p className="relative z-10 mt-16 text-xs text-charcoal-500">
        Pulse is not a medical device and does not diagnose or treat any
        condition.
      </p>
    </main>
  );
}
