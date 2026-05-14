"use client";

import { useEffect, useState } from "react";
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
      if (!res.ok) throw new Error("Failed");
      setSummary(await res.json());
    } catch { setError("Could not load weekly summary."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading summary\u2026" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!summary) return null;

  const starts = summary.successfulTransitions;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <p className="text-xs uppercase tracking-[0.2em] text-charcoal-500 mb-2">Weekly reflection</p>
      <p className="text-sm text-charcoal-400 mb-10">{summary.weekStart} &rarr; {summary.weekEnd}</p>

      {/* Lead narrative - visual centerpiece */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-charcoal-900 leading-tight text-balance">
          {starts === 0
            ? "Pulse was ready for you this week. No starts yet \u2014 and that\u2019s okay."
            : starts === 1
            ? "This week, Pulse helped you start once."
            : `This week, Pulse helped you start ${starts} times.`}
        </h1>

        {/* Inline metric chips */}
        <div className="flex flex-wrap gap-4 mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-light/60 px-4 py-1.5 text-sm font-medium text-sage ring-1 ring-inset ring-sage/15">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" /> {summary.successfulTransitions} starts
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-charcoal-100/60 px-4 py-1.5 text-sm font-medium text-charcoal-600 ring-1 ring-inset ring-charcoal-300/30">
            <span className="h-1.5 w-1.5 rounded-full bg-charcoal-300" /> {summary.dismissals} skipped
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-calm-light/60 px-4 py-1.5 text-sm font-medium text-calm ring-1 ring-inset ring-calm/15">
            <span className="h-1.5 w-1.5 rounded-full bg-calm" /> {summary.weeklyActiveInterventions} check-ins
          </span>
        </div>
      </div>

      {/* Reflection text */}
      {summary.summaryText && (
        <div className="rounded-2xl border border-charcoal-100 bg-white p-6 mb-5">
          <p className="text-xs uppercase tracking-[0.15em] text-charcoal-500 mb-4">Reflection</p>
          <p className="text-base text-charcoal-700 leading-relaxed">{humanizeText(summary.summaryText)}</p>
        </div>
      )}

      {/* Top friction callout */}
      {summary.topFrictionType && (
        <div className="rounded-xl bg-coral-light/50 p-5 ring-1 ring-inset ring-coral/10 mb-5">
          <p className="text-xs text-coral/70 mb-1">Most common friction</p>
          <p className="text-sm font-semibold text-charcoal-900">{humanizeText(summary.topFrictionType)}</p>
        </div>
      )}

      {/* Suggestion */}
      {summary.recommendedAdjustment && (
        <div className="rounded-xl bg-amber-light/50 p-5 ring-1 ring-inset ring-amber/10 mb-5">
          <p className="text-xs uppercase tracking-[0.15em] text-amber mb-2">Suggestion</p>
          <p className="text-sm text-charcoal-700 leading-relaxed">{summary.recommendedAdjustment}</p>
        </div>
      )}

      {!summary.summaryText && !summary.topFrictionType && !summary.recommendedAdjustment && (
        <p className="text-sm text-charcoal-500 italic mt-6">Keep going. Patterns emerge over time.</p>
      )}
    </div>
  );
}
