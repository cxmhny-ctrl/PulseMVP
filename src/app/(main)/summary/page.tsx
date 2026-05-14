"use client";

import { useEffect, useState } from "react";
import ReflectionCard from "@/components/ReflectionCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { formatLabel, humanizeText } from "@/lib/labels";

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
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-charcoal-900 mb-1">
        Weekly reflection
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        {summary.weekStart} &rarr; {summary.weekEnd}
      </p>

      <ReflectionCard title="Your week">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl bg-sage-light/60 p-4 ring-1 ring-inset ring-sage/10">
            <p className="text-2xl font-bold text-sage">
              {summary.weeklyActiveInterventions}
            </p>
            <p className="mt-0.5 text-xs text-sage/70">
              Interventions
            </p>
          </div>
          <div className="rounded-xl bg-calm-light/60 p-4 ring-1 ring-inset ring-calm/10">
            <p className="text-2xl font-bold text-calm">
              {summary.successfulTransitions}
            </p>
            <p className="mt-0.5 text-xs text-calm/70">
              Starts
            </p>
          </div>
          <div className="rounded-xl bg-charcoal-100/60 p-4 ring-1 ring-inset ring-charcoal-300/20">
            <p className="text-2xl font-bold text-charcoal-700">
              {summary.dismissals}
            </p>
            <p className="mt-0.5 text-xs text-charcoal-500">
              Dismissed
            </p>
          </div>
          <div className="rounded-xl bg-amber-light/60 p-4 ring-1 ring-inset ring-amber/10">
            <p className="text-2xl font-bold text-amber">
              {summary.bestChannel ? formatLabel(summary.bestChannel) : "\u2014"}
            </p>
            <p className="mt-0.5 text-xs text-amber/70">
              Best channel
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5 text-sm">
          {summary.topFrictionType && (
            <div className="flex justify-between py-1">
              <span className="text-charcoal-500">Top friction</span>
              <span className="text-charcoal-900 font-medium">
                {formatLabel(summary.topFrictionType)}
              </span>
            </div>
          )}
          {summary.bestChannel && (
            <div className="flex justify-between py-1">
              <span className="text-charcoal-500">Best channel</span>
              <span className="text-charcoal-900 font-medium">
                {formatLabel(summary.bestChannel)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-charcoal-500">Dismissed</span>
            <span className="text-charcoal-900 font-medium">
              {summary.dismissals}
            </span>
          </div>
        </div>
      </ReflectionCard>

      {/* Reflection text */}
      {summary.summaryText && (
        <ReflectionCard title="Reflection" className="mt-4">
          <p className="text-sm text-charcoal-700 leading-relaxed">
            {humanizeText(summary.summaryText)}
          </p>
        </ReflectionCard>
      )}

      {/* Suggestion */}
      {summary.recommendedAdjustment && (
        <div className="mt-4 rounded-xl bg-amber-light/60 p-5 ring-1 ring-inset ring-amber/10">
          <p className="text-xs uppercase tracking-[0.15em] text-amber mb-1.5">
            Suggestion
          </p>
          <p className="text-sm text-charcoal-700 leading-relaxed">
            {summary.recommendedAdjustment}
          </p>
        </div>
      )}
    </div>
  );
}
