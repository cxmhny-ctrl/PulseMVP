"use client";

import { useEffect, useState } from "react";
import TimelineItem from "@/components/TimelineItem";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { formatLabel } from "@/lib/labels";

interface Intervention {
  id: string; taskId: string; triggerType: string; channel: string;
  message: string; status: string; createdAt: string; task?: { title: string };
}

interface DateGroup { label: string; items: Intervention[]; }

function groupByDate(items: Intervention[]): DateGroup[] {
  const t = new Date(); t.setHours(0,0,0,0);
  const y = new Date(t); y.setDate(y.getDate()-1);
  const w = new Date(t); w.setDate(w.getDate()-7);
  const g: DateGroup[] = []; let cl = ""; let ci: Intervention[] = [];
  for (const i of items) {
    const d = new Date(i.createdAt); d.setHours(0,0,0,0);
    let l = "Earlier";
    if (d.getTime()===t.getTime()) l="Today";
    else if (d.getTime()===y.getTime()) l="Yesterday";
    else if (d.getTime()>=w.getTime()) l="This week";
    if (l!==cl) { if(ci.length) g.push({label:cl,items:ci}); cl=l; ci=[]; }
    ci.push(i);
  }
  if(ci.length) g.push({label:cl,items:ci});
  return g;
}

export default function Interventions() {
  const [items, setItems] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  async function load() {
    setLoading(true); setError(null);
    try { const r=await fetch("/api/interventions"); if(!r.ok) throw Error(""); setItems(await r.json()); }
    catch { setError("Could not load."); }
    finally { setLoading(false); }
  }
  useEffect(()=>{load();},[]);

  if(loading) return <LoadingState message="Loading history\u2026"/>;
  if(error) return <ErrorState message={error} onRetry={load}/>;

  const groups = items.length ? groupByDate(items) : [];

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <p className="text-xs uppercase tracking-[0.2em] text-charcoal-500 mb-1">History</p>
      <p className="text-sm text-charcoal-500 mb-6">A calm log of the moments you started.</p>
      {items.length===0 ? (
        <EmptyState title="No interventions yet" description="Your stuck-to-action moments will show up here as a timeline."/>
      ) : (
        <div>
          {items.length<=3 && (
            <p className="text-xs text-charcoal-400 italic mb-6 ml-7">Just getting started. Each moment counts.</p>
          )}
          {groups.map(g=>(
            <div key={g.label} className="mb-6 last:mb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400 mb-4 ml-7">{g.label}</p>
              {g.items.map(i=>{
                const started=i.status==="engaged";
                return (
                  <TimelineItem key={i.id} active={started}>
                    <div className="surface-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-charcoal-900 truncate">{i.task?.title??"Untitled task"}</p>
                          <p className="mt-1 text-xs text-charcoal-500 truncate leading-relaxed">{i.message}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`status-badge ${started?"status-badge-started":i.status==="sent"?"status-badge-nudged":"status-badge-dismissed"}`}>{formatLabel(i.status)}</span>
                          <span className="text-xs text-charcoal-400">{new Date(i.createdAt).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}</span>
                        </div>
                      </div>
                    </div>
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
