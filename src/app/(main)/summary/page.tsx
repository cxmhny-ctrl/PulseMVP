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

  if (loading) return <LoadingState message="Loading summary…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!summary) return null;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-slate-100 mb-6">
        Weekly summary
      </h1>

      <Card>
        <div className="text-center mb-6">
          <p className="text-sm text-slate-400">
            {summary.weekStart} → {summary.weekEnd}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-emerald-950/40">
            <p className="text-2xl font-bold text-emerald-300">
              {summary.weeklyActiveInterventions}
            </p>
            <p className="text-xs text-emerald-400">
              Interventions
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-950/40">
            <p className="text-2xl font-bold text-blue-300">
              {summary.successfulTransitions}
            </p>
            <p className="text-xs text-blue-400">
              Starts
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800">
            <p className="text-2xl font-bold text-slate-300">
              {summary.dismissals}
            </p>
            <p className="text-xs text-slate-400">
              Dismissed
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800">
            <p className="text-2xl font-bold text-slate-300">
              {formatLabel(summary.bestChannel)}
            </p>
            <p className="text-xs text-slate-400">
              Best channel
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {summary.topFrictionType && (
            <div className="flex justify-between">
              <span className="text-slate-400">Top friction</span>
              <span className="text-slate-100 font-medium">
                {formatLabel(summary.topFrictionType)}
              </span>
            </div>
          )}
          {summary.bestChannel && (
            <div className="flex justify-between">
              <span className="text-slate-400">Best channel</span>
              <span className="text-slate-100 font-medium">
                {formatLabel(summary.bestChannel)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Dismissed</span>
            <span className="text-slate-100 font-medium">
              {summary.dismissals}
            </span>
          </div>
        </div>

        {summary.summaryText && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-300 leading-relaxed">
              {summary.summaryText}
            </p>
          </div>
        )}

        {summary.recommendedAdjustment && (
          <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
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
