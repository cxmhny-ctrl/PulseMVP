"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

interface Intervention {
  id: string;
  taskId: string;
  triggerType: string;
  channel: string;
  message: string;
  status: string;
  createdAt: string;
  task?: { title: string };
}

const statusLabel: Record<string, { label: string; color: string }> = {
  engaged: { label: "Started", color: "text-pulse-600 bg-pulse-50 dark:bg-pulse-900 dark:text-pulse-300" },
  sent: { label: "Sent", color: "text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300" },
  dismissed: { label: "Dismissed", color: "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400" },
};

export default function Interventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interventions");
      if (!res.ok) throw new Error("Failed to load");
      setInterventions(await res.json());
    } catch {
      setError("Could not load intervention history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState message="Loading history…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Intervention history
      </h1>

      {interventions.length === 0 ? (
        <EmptyState
          title="No interventions yet"
          description="Your stuck-to-action transitions will show up here."
        />
      ) : (
        <div className="space-y-3">
          {interventions.map((i) => {
            const s = statusLabel[i.status] ?? { label: i.status, color: "text-gray-500" };
            return (
              <Card key={i.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {i.task?.title ?? "Untitled task"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                      {i.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}
                    >
                      {s.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(i.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
