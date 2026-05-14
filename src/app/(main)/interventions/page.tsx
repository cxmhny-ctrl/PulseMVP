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

  if (loading) return <LoadingState message="Loading history\u2026" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-slate-100 mb-1">
        History
      </h1>
      <p className="text-xs text-slate-500 mb-6">
        A calm log of the moments you started.
      </p>

      {interventions.length === 0 ? (
        <EmptyState
          title="No interventions yet"
          description="Your stuck-to-action moments will show up here as a timeline."
        />
      ) : (
        <div>
          {interventions.map((i) => {
            const isStarted = i.status === "engaged";
            return (
              <div
                key={i.id}
                className={`timeline-item ${isStarted ? "timeline-item-active" : ""}`}
              >
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {i.task?.title ?? "Untitled task"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 truncate">
                        {i.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`status-badge ${
                          i.status === "engaged"
                            ? "status-badge-success"
                            : i.status === "sent"
                            ? "status-badge-info"
                            : "status-badge-muted"
                        }`}
                      >
                        {formatLabel(i.status)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(i.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
