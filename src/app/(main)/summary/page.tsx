"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { formatLabel } from "@/lib/labels";

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
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/summaries/weekly/current");
      if (!res.ok) throw new Error("Failed to load");
      setSummary(await res.json());
    } catch {
      setError("Could not load weekly summary.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState message="Loading summary\u2026" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!summary) return null;

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-slate-100 mb-2">
        Weekly reflection
      </h1>
      <p className="text-sm text-slate-400 mb-6">
        {summary.weekStart} &rarr; {summary.weekEnd}
      </p>

      <Card>
        {/* Stat grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl bg-emerald-950/30 p-4 ring-1 ring-inset ring-emerald-500/10">
            <p className="text-2xl font-bold text-emerald-300">
              {summary.weeklyActiveInterventions}
            </p>
            <p className="mt-0.5 text-xs text-emerald-400/70">
              Interventions
            </p>
          </div>
          <div className="rounded-xl bg-blue-950/20 p-4 ring-1 ring-inset ring-blue-500/10">
            <p className="text-2xl font-bold text-blue-300">
              {summary.successfulTransitions}
            </p>
            <p className="mt-0.5 text-xs text-blue-400/70">
              Starts
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/40 p-4 ring-1 ring-inset ring-slate-700/30">
            <p className="text-2xl font-bold text-slate-300">
              {summary.dismissals}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Dismissed
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/40 p-4 ring-1 ring-inset ring-slate-700/30">
            <p className="text-2xl font-bold text-slate-300">
              {formatLabel(summary.bestChannel)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Best channel
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5 text-sm">
          {summary.topFrictionType && (
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Top friction</span>
              <span className="text-slate-100 font-medium">
                {formatLabel(summary.topFrictionType)}
              </span>
            </div>
          )}
          {summary.bestChannel && (
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Best channel</span>
              <span className="text-slate-100 font-medium">
                {formatLabel(summary.bestChannel)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Dismissed</span>
            <span className="text-slate-100 font-medium">
              {summary.dismissals}
            </span>
          </div>
        </div>

        {/* Reflection text */}
        {summary.summaryText && (
          <div className="mt-6 pt-6 border-t border-slate-800/60">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
              Reflection
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {summary.summaryText}
            </p>
          </div>
        )}

        {/* Suggestion */}
        {summary.recommendedAdjustment && (
          <div className="mt-4 rounded-xl bg-slate-800/40 p-4 ring-1 ring-inset ring-slate-700/30">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1.5">
              Suggestion
            </p>
            <p className="text-sm text-slate-300">
              {summary.recommendedAdjustment}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
