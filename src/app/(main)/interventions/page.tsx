"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { formatLabel } from "@/lib/labels";

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

const statusColor: Record<string, string> = {
  engaged: "text-emerald-300 bg-emerald-950/40",
  sent: "text-blue-300 bg-blue-950/40",
  dismissed: "text-slate-300 bg-slate-800",
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
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-slate-100 mb-6">
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
            const c = statusColor[i.status] ?? "text-slate-300 bg-slate-800";
            return (
              <Card key={i.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">
                      {i.task?.title ?? "Untitled task"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 truncate">
                      {i.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${c}`}
                    >
                      {formatLabel(i.status)}
                    </span>
                    <span className="text-xs text-slate-500">
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
