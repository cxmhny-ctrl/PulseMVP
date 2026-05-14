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
  const [error,   setError]   = useState<string | null>(null);

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

  if (loading) return <LoadingState message="Loading summary…" />;
  if (error)   return <ErrorState  message={error} onRetry={load} />;
  if (!summary) return null;

  const starts  = summary.successfulTransitions;

  const headline =
    starts === 0
      ? "Pulse was ready for you. No starts yet — and that's okay."
      : starts === 1
      ? "This week, Pulse helped you start once."
      : `This week, Pulse helped you start ${starts} times.`;

  return (
    <div className="animate-fade-in max-w-2xl">

      {/* ── Header ───────────────────────────────────────── */}
      <p className="eyebrow mb-2">Weekly reflection</p>
      <p className="text-xs text-muted mb-10">
        {summary.weekStart} &rarr; {summary.weekEnd}
      </p>

      {/* ── Hero headline ────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="headline-lg">{headline}</h1>

        {/* Metric chips */}
        <div className="flex flex-wrap gap-3 mt-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-light border border-sage/20 px-4 py-1.5 text-sm font-medium text-sage">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden />
            {summary.successfulTransitions} start{summary.successfulTransitions !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-border-subtle border border-border px-4 py-1.5 text-sm font-medium text-muted-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-charcoal-300" aria-hidden />
            {summary.dismissals} skipped
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-calm-light border border-calm/20 px-4 py-1.5 text-sm font-medium text-calm">
            <span className="h-1.5 w-1.5 rounded-full bg-calm" aria-hidden />
            {summary.weeklyActiveInterventions} check-in{summary.weeklyActiveInterventions !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Big stat ─────────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-surface-raised p-8 mb-5 flex items-end gap-5">
        <div>
          <p className="eyebrow mb-2">Success rate</p>
          <p className="font-serif text-6xl font-bold text-foreground leading-none">
            {summary.weeklyActiveInterventions > 0
              ? Math.round((starts / summary.weeklyActiveInterventions) * 100)
              : 0}
            <span className="text-3xl text-muted ml-1">%</span>
          </p>
          <p className="text-xs text-muted mt-2">of check-ins turned into action</p>
        </div>
        <div className="ml-auto hidden sm:block">
          {/* Pulse mark decorative */}
          <span className="relative flex h-14 w-14 items-center justify-center" aria-hidden>
            <span className="absolute inset-0 rounded-full border border-sage/20" />
            <span className="absolute inset-[6px] rounded-full border border-sage/35" />
            <span className="absolute inset-[12px] rounded-full border border-sage/50" />
            <span className="h-3 w-3 rounded-full bg-sage animate-breathe" />
          </span>
        </div>
      </div>

      {/* ── Reflection text ──────────────────────────────── */}
      {summary.summaryText && (
        <div className="rounded-3xl border border-border bg-surface-raised p-7 mb-5">
          <p className="eyebrow mb-4">Reflection</p>
          <p className="text-base text-muted-strong leading-relaxed text-pretty">
            {humanizeText(summary.summaryText)}
          </p>
        </div>
      )}

      {/* ── Friction + Suggestion row ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {summary.topFrictionType && (
          <div className="rounded-2xl border border-coral/20 bg-coral-light/40 p-5">
            <p className="eyebrow text-coral/70 mb-2">Most common friction</p>
            <p className="text-base font-semibold text-foreground">
              {humanizeText(summary.topFrictionType)}
            </p>
          </div>
        )}
        {summary.recommendedAdjustment && (
          <div className="rounded-2xl border border-amber/20 bg-amber-light/50 p-5">
            <p className="eyebrow text-amber/70 mb-2">Suggestion</p>
            <p className="text-sm text-muted-strong leading-relaxed text-pretty">
              {summary.recommendedAdjustment}
            </p>
          </div>
        )}
      </div>

      {!summary.summaryText && !summary.topFrictionType && !summary.recommendedAdjustment && (
        <p className="text-sm text-muted italic mt-4">Keep going. Patterns emerge over time.</p>
      )}
    </div>
  );
}
