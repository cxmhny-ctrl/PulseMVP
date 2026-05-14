"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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

interface Summary {
  weeklyActiveInterventions: number;
  successfulTransitions: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [wai, setWai] = useState<number | null>(null);
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

    if (!tRes && !sRes) {
      setError("Could not load dashboard.");
      setLoading(false);
      return;
    }

    if (tRes?.ok) {
      try {
        const tData = await tRes.json();
        setTasks(tData.filter((t: Task) => t.status === "active"));
      } catch {
        // tasks failed — leave tasks as empty array
      }
    }

    if (sRes?.ok) {
      try {
        const sData = await sRes.json();
        setWai(sData.weeklyActiveInterventions ?? null);
      } catch {
        // summary failed — leave WAI as null
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-100">
          Dashboard
        </h1>
        <Link href="/tasks/new">
          <Button>+ New task</Button>
        </Link>
      </div>

      {wai !== null && (
        <Card className="border-emerald-900/40 bg-emerald-950/40">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <p className="text-sm text-slate-200">
              <span className="font-semibold text-emerald-300">{wai}</span>{" "}
              intervention{wai !== 1 ? "s" : ""} this week
            </p>
          </div>
        </Card>
      )}

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Say one thing you want help starting."
          action={
            <Link href="/tasks/new">
              <Button>Create a task</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-100 truncate">
                    {task.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                      {formatLabel(task.energyRequired)}
                    </span>
                    {task.currentNextStep && (
                      <span className="truncate max-w-xs text-slate-400">
                        Next: {task.currentNextStep}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/stuck/${task.id}`)}
                  className="shrink-0"
                >
                  I&rsquo;m stuck
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
