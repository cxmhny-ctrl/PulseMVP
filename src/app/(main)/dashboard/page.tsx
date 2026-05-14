"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

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
    try {
      const [tRes, sRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/summaries/weekly/current"),
      ]);
      if (!tRes.ok || !sRes.ok) throw new Error("Failed to load");
      const tData = await tRes.json();
      const sData = await sRes.json();
      setTasks(tData.filter((t: Task) => t.status === "active"));
      setWai(sData.weeklyActiveInterventions);
    } catch {
      setError("Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          {wai !== null && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {wai} intervention{wai !== 1 ? "s" : ""} this week
            </p>
          )}
        </div>
        <Link href="/tasks/new">
          <Button>+ New task</Button>
        </Link>
      </div>

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
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {task.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5">
                      {task.energyRequired} energy
                    </span>
                    {task.currentNextStep && (
                      <span className="truncate max-w-xs">
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
