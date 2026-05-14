"use client";

import { useEffect, useState } from "react";
import ReflectionCard from "@/components/ReflectionCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { humanizeText } from "@/lib/labels";

interface Summary {
  weekStart: string;
  weekEnd: string;
  weeklyActiveInterventions: number;
  successfulTransitions: number;
  dismissals: number;
  topFrictionType: string | null;
  bestChannel: string | null;
  recommendedAdjustment: string | null;
  summaryText: string;
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/summaries/weekly/current");
      if (!res.ok) throw new Error("Failed to load");
      setSummary(await res.json());
    } catch { setError("Could not load weekly summary."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading summary\u2026" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!summary) return null;

  const starts = summary.successfulTransitions;
  const narrative = starts === 0
    ? "Pulse was ready for you this week. No starts yet \u2014 and that\u2019s okay."
    : starts === 1
    ? "This week, Pulse helped you start once."
    : `This week, Pulse helped you start ${starts} times.`;

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-charcoal-900 mb-1">Weekly reflection</h1>
      <p className="text-sm text-charcoal-500 mb-6">{summary.weekStart} &rarr; {summary.weekEnd}</p>

      {/* Lead narrative */}
      <div className="surface-card relative overflow-hidden mb-4">
        <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-48 rounded-full bg-sage/5 blur-2xl" />
        <div className="relative">
          <p className="text-lg font-medium text-charcoal-900 leading-relaxed text-balance">
            {narrative}
          </p>
          <p className="mt-1.5 text-sm text-charcoal-500">
            {starts > 0
              ? `With ${summary.weeklyActiveInterventions} check-in${summary.weeklyActiveInterventions !== 1 ? "s" : ""} and ${summary.dismissals} skipped.`
              : `Pulse checked in ${summary.weeklyActiveInterventions} time${summary.weeklyActiveInterventions !== 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>

      {/* Supporting metrics - subtle grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl bg-sage-light/40 p-3 ring-1 ring-inset ring-sage/10 text-center">
          <p className="text-lg font-bold text-sage">{summary.successfulTransitions}</p>
          <p className="text-[10px] text-sage/70">Starts</p>
        </div>
        <div className="rounded-xl bg-charcoal-100/60 p-3 ring-1 ring-inset ring-charcoal-300/20 text-center">
          <p className="text-lg font-bold text-charcoal-700">{summary.dismissals}</p>
          <p className="text-[10px] text-charcoal-500">Skipped</p>
        </div>
        <div className="rounded-xl bg-calm-light/40 p-3 ring-1 ring-inset ring-calm/10 text-center">
          <p className="text-lg font-bold text-calm">{summary.weeklyActiveInterventions}</p>
          <p className="text-[10px] text-calm/70">Check-ins</p>
        </div>
      </div>

      {/* Top friction */}
      {summary.topFrictionType && (
        <div className="rounded-xl bg-coral-light/40 p-4 ring-1 ring-inset ring-coral/10 mb-4">
          <p className="text-xs text-coral/70 mb-0.5">Most common friction</p>
          <p className="text-sm font-medium text-charcoal-900">{humanizeText(summary.topFrictionType)}</p>
        </div>
      )}

      {/* Reflection text */}
      {summary.summaryText && (
        <div className="surface-warm mb-4">
          <p className="text-xs uppercase tracking-[0.15em] text-charcoal-500 mb-3">Reflection</p>
          <p className="text-sm text-charcoal-700 leading-relaxed">{humanizeText(summary.summaryText)}</p>
        </div>
      )}

      {/* Suggestion */}
      {summary.recommendedAdjustment && (
        <div className="rounded-xl bg-amber-light/40 p-4 ring-1 ring-inset ring-amber/10">
          <p className="text-xs uppercase tracking-[0.15em] text-amber mb-1.5">Suggestion</p>
          <p className="text-sm text-charcoal-700 leading-relaxed">{summary.recommendedAdjustment}</p>
        </div>
      )}
    </div>
  );
}
