export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-warm-paper px-4 text-center">
      {/* Ambient warm glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[500px] w-[500px] items-center justify-center">
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-sage/8" style={{ animationDelay: "0s" }} />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-sage/5" style={{ animationDelay: "0.7s" }} />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-amber/5" style={{ animationDelay: "1.4s" }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal-500 mb-4">
          For ADHD minds
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-charcoal-900">
          Start when you&apos;re stuck
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-charcoal-700">
          Pulse gives you the next tiny step. No planning. No shame.
        </p>
      </div>

      {/* StuckPath visual */}
      <div className="relative z-10 mt-14 flex flex-col sm:flex-row items-center gap-3 sm:gap-0">
        {/* Step 1: Stuck */}
        <div className="flex flex-col items-center gap-2 sm:flex-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-coral/15 bg-coral-light/60 shadow-[inset_0_1px_0_rgba(212,105,94,0.1)]">
            <span className="text-sm font-semibold text-coral/80">Stuck</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-500">
            You are here
          </span>
        </div>

        {/* Connector */}
        <div className="sm:flex-1 sm:max-w-16 flex flex-col items-center">
          <span className="hidden sm:block h-px w-full bg-gradient-to-r from-coral/20 via-sage/40 to-transparent" />
          <span className="sm:hidden h-6 w-px bg-gradient-to-b from-coral/20 via-sage/40 to-transparent" />
        </div>

        {/* Step 2: Tiny step */}
        <div className="flex flex-col items-center gap-2 sm:flex-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sage/20 bg-sage-light shadow-[inset_0_1px_0_rgba(74,155,127,0.1)]">
            <span className="text-sm font-semibold text-sage/80">Step</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-500">
            Next tiny step
          </span>
        </div>

        {/* Connector */}
        <div className="sm:flex-1 sm:max-w-16 flex flex-col items-center">
          <span className="hidden sm:block h-px w-full bg-gradient-to-r from-sage/30 via-sage/50 to-transparent" />
          <span className="sm:hidden h-6 w-px bg-gradient-to-b from-sage/30 via-sage/50 to-transparent" />
        </div>

        {/* Step 3: Started */}
        <div className="flex flex-col items-center gap-2 sm:flex-1">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-sage/25 bg-sage-light shadow-[inset_0_1px_0_rgba(74,155,127,0.15)]">
            <span className="text-sm font-semibold text-sage">Done</span>
            <div className="absolute -inset-1 rounded-2xl bg-sage/5 blur-md animate-breathe" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-500">
            Started
          </span>
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
