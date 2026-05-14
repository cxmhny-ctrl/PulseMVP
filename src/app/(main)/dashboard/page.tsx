"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { formatLabel } from "@/lib/labels";

interface Task {
  id: string;
  title: string;
  status: string;
  energyRequired: string;
  currentNextStep: string | null;
  createdAt: string;
}

const energyAccent: Record<string, string> = {
  low:    "bg-amber",
  medium: "bg-sage",
  high:   "bg-calm",
};

const energyLabel: Record<string, string> = {
  low:    "Low energy",
  medium: "Medium energy",
  high:   "High energy",
};

export default function Dashboard() {
  const router = useRouter();
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [starts,  setStarts]  = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    const results = await Promise.allSettled([
      fetch("/api/tasks"),
      fetch("/api/summaries/weekly/current"),
    ]);
    const tRes = results[0].status === "fulfilled" ? results[0].value : null;
    const sRes = results[1].status === "fulfilled" ? results[1].value : null;
    if (!tRes && !sRes) { setError("Could not load dashboard."); setLoading(false); return; }
    if (tRes?.ok) {
      try { const d = await tRes.json(); setTasks(d.filter((t: Task) => t.status === "active")); } catch { /* */ }
    }
    if (sRes?.ok) {
      try { const d = await sRes.json(); setStarts(d.successfulTransitions ?? 0); } catch { /* */ }
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading dashboard…" />;
  if (error)   return <ErrorState  message={error} onRetry={load} />;

  const [primaryTask, ...otherTasks] = tasks;

  return (
    <div className="animate-fade-in space-y-8">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Your workspace</p>
          <h1 className="headline-md">Dashboard</h1>
        </div>
        <Link href="/tasks/new">
          <Button>+ New task</Button>
        </Link>
      </div>

      {/* ── Stat strip ───────────────────────────────────── */}
      <div className="flex items-center gap-6 border-y border-border py-4">
        <div>
          <p className="eyebrow mb-0.5">This week</p>
          <p className="font-serif text-3xl font-bold text-foreground">{starts}</p>
          <p className="text-xs text-muted mt-0.5">successful starts</p>
        </div>
        <div className="h-10 w-px bg-border" aria-hidden />
        <div>
          <p className="eyebrow mb-0.5">Active tasks</p>
          <p className="font-serif text-3xl font-bold text-foreground">{tasks.length}</p>
          <p className="text-xs text-muted mt-0.5">in progress</p>
        </div>
        {starts > 0 && (
          <>
            <div className="h-10 w-px bg-border" aria-hidden />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sage animate-breathe" aria-hidden />
              <p className="text-xs text-muted-strong">Pulse is working</p>
            </div>
          </>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Say one thing you want help starting."
          action={<Link href="/tasks/new"><Button>Create a task</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: task list (2 cols) ─────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Primary focus module */}
            {primaryTask && (
              <div className="relative overflow-hidden rounded-3xl border-2 border-sage/25 bg-surface-raised p-8 transition-all duration-300 hover:border-sage/40">
                {/* Ambient sage wash */}
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-sage/6 blur-3xl"
                  aria-hidden
                />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`h-2 w-2 rounded-full ${energyAccent[primaryTask.energyRequired] ?? "bg-sage"}`}
                      aria-hidden
                    />
                    <p className="eyebrow">Active focus</p>
                  </div>

                  <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground leading-tight text-balance">
                    {primaryTask.title}
                  </h2>

                  <p className="mt-2 text-xs text-muted">
                    {energyLabel[primaryTask.energyRequired] ?? formatLabel(primaryTask.energyRequired)}
                  </p>

                  {/* Next step highlight */}
                  {primaryTask.currentNextStep && (
                    <div className="mt-6 rounded-2xl bg-amber-light/50 border border-amber/15 px-5 py-4">
                      <p className="eyebrow text-amber/70 mb-2">Current next step</p>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {primaryTask.currentNextStep}
                      </p>
                    </div>
                  )}

                  {/* CTA row */}
                  <div className="mt-7 flex items-center gap-5">
                    <button
                      onClick={() => router.push(`/stuck/${primaryTask.id}`)}
                      className="inline-flex items-center justify-center rounded-full bg-foreground px-7 h-11 text-sm font-semibold text-background transition-all duration-200 hover:bg-ink/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
                    >
                      I&rsquo;m stuck
                    </button>
                    <span className="text-xs text-muted hidden sm:block">
                      Pulse finds your next tiny step
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Other tasks */}
            {otherTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface-raised px-6 py-5 transition-all duration-200 hover:border-sage/25 hover:shadow-sm"
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${energyAccent[task.energyRequired] ?? "bg-sage"}`}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{task.title}</h3>
                  {task.currentNextStep && (
                    <p className="mt-0.5 text-xs text-muted truncate">
                      {task.currentNextStep}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/stuck/${task.id}`)}
                  className="shrink-0 inline-flex items-center justify-center rounded-full border border-border px-4 h-8 text-xs font-medium text-muted-strong transition-all duration-150 hover:border-sage/30 hover:text-sage hover:bg-sage-light/40 active:scale-[0.97]"
                >
                  I&rsquo;m stuck
                </button>
              </div>
            ))}
          </div>

          {/* ── Right: Pulse panel (1 col) ───────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-3xl border border-border bg-surface p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                {/* Pulse mark */}
                <span className="relative flex h-8 w-8 items-center justify-center shrink-0" aria-hidden>
                  <span className="absolute inset-0 rounded-full border border-sage/25" />
                  <span className="absolute inset-[5px] rounded-full border border-sage/40" />
                  <span className="h-2 w-2 rounded-full bg-sage animate-breathe" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Today&rsquo;s Pulse</h3>
                  <p className="text-xs text-muted">
                    {starts > 0 ? `${starts} start${starts !== 1 ? "s" : ""} this week` : "Ready when you are"}
                  </p>
                </div>
              </div>

              {/* Weekly starts */}
              <div className="rounded-2xl bg-sage-light/50 border border-sage/12 p-4">
                <p className="eyebrow text-sage/70 mb-1">Successful starts</p>
                <p className="font-serif text-4xl font-bold text-sage">{starts}</p>
                <p className="text-xs text-sage/60 mt-1">this week</p>
              </div>

              {/* Next step callout */}
              {primaryTask?.currentNextStep && (
                <div className="rounded-2xl bg-amber-light/40 border border-amber/12 p-4">
                  <p className="eyebrow text-amber/70 mb-2">Current next step</p>
                  <p className="text-sm font-medium text-foreground leading-snug">{primaryTask.currentNextStep}</p>
                  <p className="mt-1 text-xs text-muted truncate">{primaryTask.title}</p>
                </div>
              )}

              {starts === 0 && (
                <p className="text-xs text-muted leading-relaxed border-t border-border pt-4">
                  No pressure. Pulse is here when something feels stuck.
                </p>
              )}

              <p className="text-[10px] text-muted border-t border-border pt-4 leading-relaxed">
                Each &ldquo;Start&rdquo; is a win. Pulse tracks your rhythm, not your output.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
