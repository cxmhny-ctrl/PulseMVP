export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-100">
        Start when you&apos;re stuck
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-300">
        Pulse gives you the next tiny step. No planning. No shame.
      </p>
      <div className="mt-10 flex gap-4">
        <a
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 h-10 px-5 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Set up Pulse
        </a>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 h-10 px-5 text-sm font-medium text-slate-300 transition-all duration-150 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Dashboard
        </a>
      </div>
      <p className="mt-16 text-xs text-slate-500">
        Pulse is not a medical device and does not diagnose or treat any
        condition.
      </p>
    </main>
  );
}
