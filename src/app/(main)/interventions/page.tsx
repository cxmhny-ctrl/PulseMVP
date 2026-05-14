"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import TimelineItem from "@/components/TimelineItem";
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

interface DateGroup {
  label: string;
  items: Intervention[];
}

function groupByDate(interventions: Intervention[]): DateGroup[] {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: DateGroup[] = [];
  let currentLabel = "";
  let currentItems: Intervention[] = [];

  for (const item of interventions) {
    const d = new Date(item.createdAt); d.setHours(0, 0, 0, 0);
    let label = "";
    if (d.getTime() === today.getTime()) label = "Today";
    else if (d.getTime() === yesterday.getTime()) label = "Yesterday";
    else if (d.getTime() >= weekAgo.getTime()) label = "This week";
    else label = "Earlier";

    if (label !== currentLabel) {
      if (currentItems.length > 0) groups.push({ label: currentLabel, items: currentItems });
      currentLabel = label;
      currentItems = [];
    }
    currentItems.push(item);
  }
  if (currentItems.length > 0) groups.push({ label: currentLabel, items: currentItems });
  return groups;
}

export default function Interventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/interventions");
      if (!res.ok) throw new Error("Failed to load");
      setInterventions(await res.json());
    } catch { setError("Could not load intervention history."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading history\u2026" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const dateGroups = interventions.length > 0 ? groupByDate(interventions) : [];

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-charcoal-900 mb-1">History</h1>
      <p className="text-sm text-charcoal-500 mb-6">A calm log of the moments you started.</p>

      {interventions.length === 0 ? (
        <EmptyState title="No interventions yet" description="Your stuck-to-action moments will show up here as a timeline." />
      ) : (
        <div>
          {dateGroups.map((group) => (
            <div key={group.label} className="mb-6 last:mb-0">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-400 mb-3 ml-6">{group.label}</p>
              {group.items.map((i) => {
                const isStarted = i.status === "engaged";
                return (
                  <TimelineItem key={i.id} active={isStarted}>
                    <Card>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-charcoal-900 truncate">{i.task?.title ?? "Untitled task"}</p>
                          <p className="mt-1 text-xs text-charcoal-500 truncate leading-relaxed">{i.message}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`status-badge ${
                            i.status === "engaged" ? "status-badge-started" : i.status === "sent" ? "status-badge-nudged" : "status-badge-dismissed"
                          }`}>
                            {formatLabel(i.status)}
                          </span>
                          <span className="text-xs text-charcoal-400">
                            {new Date(i.createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </TimelineItem>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
