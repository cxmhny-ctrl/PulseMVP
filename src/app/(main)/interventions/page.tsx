"use client";

import { useEffect, useState } from "react";
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

function groupByDate(items: Intervention[]): DateGroup[] {
  const t = new Date(); t.setHours(0,0,0,0);
  const y = new Date(t); y.setDate(y.getDate()-1);
  const w = new Date(t); w.setDate(w.getDate()-7);
  const g: DateGroup[] = []; let cl = ""; let ci: Intervention[] = [];
  for (const i of items) {
    const d = new Date(i.createdAt); d.setHours(0,0,0,0);
    let l = "Earlier";
    if (d.getTime() === t.getTime())      l = "Today";
    else if (d.getTime() === y.getTime()) l = "Yesterday";
    else if (d.getTime() >= w.getTime())  l = "This week";
    if (l !== cl) { if (ci.length) g.push({ label: cl, items: ci }); cl = l; ci = []; }
    ci.push(i);
  }
  if (ci.length) g.push({ label: cl, items: ci });
  return g;
}

const statusStyles: Record<string, string> = {
  engaged:   "bg-sage-light text-sage border-sage/20",
  sent:      "bg-calm-light text-calm border-calm/20",
  dismissed: "bg-border-subtle text-muted border-border",
};

export default function Interventions() {
  const [items,   setItems]   = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const r = await fetch("/api/interventions");
      if (!r.ok) throw Error("");
      setItems(await r.json());
    } catch { setError("Could not load."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading history…" />;
  if (error)   return <ErrorState  message={error} onRetry={load} />;

  const groups = items.length ? groupByDate(items) : [];

  return (
    <div className="animate-fade-in max-w-xl">
      {/* ── Page header ──────────────────────────────────── */}
      <p className="eyebrow mb-2">Your journey</p>
      <h1 className="headline-md mb-1">History</h1>
      <p className="text-sm text-muted mb-10">A calm log of the moments you started.</p>

      {items.length === 0 ? (
        <EmptyState
          title="No interventions yet"
          description="Your stuck-to-action moments will appear here as a timeline."
        />
      ) : (
        <div className="space-y-10">
          {items.length <= 3 && (
            <p className="text-xs text-muted italic">Just getting started. Each moment counts.</p>
          )}

          {groups.map((group) => (
            <div key={group.label}>
              {/* Date group label */}
              <p className="eyebrow mb-5">{group.label}</p>

              {/* Timeline */}
              <div className="relative space-y-4 pl-6">
                {/* Vertical line */}
                <span
                  className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
                  aria-hidden
                />

                {group.items.map((item) => {
                  const started = item.status === "engaged";
                  return (
                    <div key={item.id} className="relative">
                      {/* Timeline dot */}
                      <span
                        className={`absolute -left-[19px] top-4 h-3.5 w-3.5 rounded-full border-2 transition-colors duration-200
                          ${started
                            ? "border-sage/50 bg-sage-light"
                            : "border-border bg-surface-raised"}`}
                        aria-hidden
                      />

                      {/* Card */}
                      <div className="rounded-2xl border border-border bg-surface-raised p-4 transition-all duration-200 hover:border-sage/20 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.task?.title ?? "Untitled task"}
                            </p>
                            <p className="mt-1 text-xs text-muted leading-relaxed text-pretty line-clamp-2">
                              {item.message}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide
                                ${statusStyles[item.status] ?? statusStyles.dismissed}`}
                            >
                              {formatLabel(item.status)}
                            </span>
                            <span className="text-[10px] text-muted">
                              {new Date(item.createdAt).toLocaleTimeString(undefined, {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
