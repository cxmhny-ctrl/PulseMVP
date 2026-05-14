"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import PulseOrb from "@/components/PulseOrb";
import { formatLabel } from "@/lib/labels";

interface Task {
  id: string;
  title: string;
  status: string;
  energyRequired: string;
  currentNextStep: string | null;
  createdAt: string;
}

interface Summary {
  weeklyActiveInterventions: number;
  successfulTransitions: number;
}

const energyClass: Record<string, string> = {
  low: "border-l-amber/40",
  medium: "border-l-sage/40",
  high: "border-l-calm/40",
};

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [wai, setWai] = useState<number | null>(null);
  const [starts, setStarts] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const results = await Promise.allSettled([
      fetch("/api/tasks"),
      fetch("/api/summaries/weekly/current"),
    ]);
    const tRes = results[0].status === "fulfilled" ? results[0].value : null;
    const sRes = results[1].status === "fulfilled" ? results[1].value : null;
    if (!tRes && !sRes) { setError("Could not load dashboard."); setLoading(false); return; }
    if (tRes?.ok) { try { const tData = await tRes.json(); setTasks(tData.filter((t: Task) => t.status === "active")); } catch { /* */ } }
    if (sRes?.ok) { try { const sData = await sRes.json(); setWai(sData.weeklyActiveInterventions ?? null); setStarts(sData.successfulTransitions ?? 0); } catch { /* */ } }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading dashboard\u2026" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const firstTaskWithStep = tasks.find((t) => t.currentNextStep);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-charcoal-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-charcoal-500">Your active tasks and this week&rsquo;s pulse.</p>
        </div>
        <Link href="/tasks/new"><Button>+ New task</Button></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: tasks */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pulse status card */}
          <div className="surface-card relative overflow-hidden">
            <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-64 rounded-full bg-sage/4 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="pulse-orb h-8 w-8 shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal-900">Pulse is active</p>
                <p className="mt-0.5 text-xs text-charcoal-500">
                  {wai !== null ? `${wai} intervention${wai !== 1 ? "s" : ""} this week` : "Monitoring for stuck moments"}
                </p>
              </div>
            </div>
          </div>

          {/* Tasks */}
          {tasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="Say one thing you want help starting." action={<Link href="/tasks/new"><Button>Create a task</Button></Link>} />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className={`surface-card ${energyClass[task.energyRequired] ?? "border-l-sage/40"} border-l-2`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-medium text-charcoal-900 truncate">{task.title}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center rounded-full bg-charcoal-100/60 px-2.5 py-0.5 text-xs font-medium text-charcoal-700 ring-1 ring-inset ring-charcoal-300/30">
                          {formatLabel(task.energyRequired)}
                        </span>
                        {task.currentNextStep && (
                          <span className="inline-flex items-center gap-1.5 text-charcoal-500">
                            <span className="h-1 w-1 rounded-full bg-sage/60" />
                            <span className="italic">Next:</span> {task.currentNextStep}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="secondary" onClick={() => router.push(`/stuck/${task.id}`)} className="shrink-0 border-amber/20 bg-amber-light/30 text-amber hover:bg-amber-light/60 hover:text-amber">
                      I&rsquo;m stuck
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Today's Pulse */}
        <div className="lg:col-span-1">
          <div className="surface-warm">
            <div className="flex items-center gap-3 mb-5">
              <PulseOrb size="sm" />
              <div>
                <h3 className="text-sm font-semibold text-charcoal-900">Today&rsquo;s Pulse</h3>
                <p className="text-xs text-charcoal-500">
                  {starts > 0 ? `${starts} start${starts !== 1 ? "s" : ""} this week` : "Ready when you are"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-sage-light/40 p-3 ring-1 ring-inset ring-sage/10">
                <p className="text-xs text-sage/70">This week</p>
                <p className="mt-0.5 text-lg font-bold text-sage">{starts}</p>
                <p className="text-xs text-sage/60">successful starts</p>
              </div>

              {firstTaskWithStep?.currentNextStep && (
                <div className="rounded-xl bg-amber-light/30 p-3 ring-1 ring-inset ring-amber/10">
                  <p className="text-xs text-amber/70">Current next step</p>
                  <p className="mt-1 text-sm font-medium text-charcoal-700 leading-snug">{firstTaskWithStep.currentNextStep}</p>
                  <p className="mt-0.5 text-xs text-charcoal-500 truncate">{firstTaskWithStep.title}</p>
                </div>
              )}

              {starts === 0 && (
                <div className="rounded-xl bg-calm-light/30 p-3 ring-1 ring-inset ring-calm/10">
                  <p className="text-xs text-calm/70 leading-relaxed">
                    No pressure. Pulse is here when something feels stuck.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-charcoal-100">
              <p className="text-[10px] text-charcoal-400 leading-relaxed">
                Each &ldquo;Start&rdquo; is a win. Pulse tracks your rhythm, not your output.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
