export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Pulse
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-600 dark:text-gray-400">
        No complex planning. No shame. The next tiny step.
      </p>
      <div className="mt-10 flex gap-4">
        <a
          href="/onboarding"
          className="rounded-lg bg-pulse-600 px-6 py-3 text-sm font-medium text-white hover:bg-pulse-700 transition-colors"
        >
          Set up Pulse
        </a>
        <a
          href="/dashboard"
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          Dashboard
        </a>
      </div>
      <p className="mt-16 text-xs text-gray-400 dark:text-gray-600">
        Pulse is not a medical device and does not diagnose or treat any
        condition.
      </p>
    </main>
  );
}
