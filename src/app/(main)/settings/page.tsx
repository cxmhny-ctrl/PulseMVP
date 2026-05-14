"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

const styleOptions = [
  { value: "gentle", label: "Gentle" },
  { value: "direct", label: "Direct" },
  { value: "funny", label: "Funny" },
  { value: "ultra_minimal", label: "Ultra-minimal" },
];

const sensitivityOptions = [
  { value: "low", label: "Low \u2014 fewer nudges" },
  { value: "medium", label: "Medium \u2014 balanced" },
  { value: "high", label: "High \u2014 more check-ins" },
];

export default function Settings() {
  const router = useRouter();
  const [supportStyle, setSupportStyle] = useState("gentle");
  const [sensitivity, setSensitivity] = useState("medium");
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      if (data.settings) {
        setSupportStyle(data.settings.supportStyle ?? "gentle");
        setSensitivity(data.settings.stuckSensitivity ?? "medium");
        setQuietStart(data.settings.quietHoursStart ?? "22:00");
        setQuietEnd(data.settings.quietHoursEnd ?? "08:00");
      }
    } catch {
      setError("Could not load settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supportStyle,
          stuckSensitivity: sensitivity,
          quietHoursStart: quietStart,
          quietHoursEnd: quietEnd,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
    } catch {
      setError("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState message="Loading settings\u2026" />;
  if (error && supportStyle === "gentle" && sensitivity === "medium")
    return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-slate-100 mb-6">
        Settings
      </h1>

      <Card>
        <div className="space-y-5">
          {/* Tone section */}
          <div className="space-y-4 pb-5 border-b border-slate-800/60">
            <Select
              label="Support style"
              options={styleOptions}
              value={supportStyle}
              onChange={(e) => setSupportStyle(e.target.value)}
            />
            <Select
              label="Stuck sensitivity"
              options={sensitivityOptions}
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
            />
          </div>

          {/* Quiet hours section */}
          <div className="space-y-4 pb-5 border-b border-slate-800/60">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Quiet hours
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Pulse won&apos;t send nudges during these hours.
              </p>
            </div>
            <div className="flex gap-4">
              <Input
                label="Start"
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
              />
              <Input
                label="End"
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
              />
            </div>
          </div>

          {saved && (
            <p className="text-sm font-medium text-emerald-400">
              Settings saved.
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? "Saving\u2026" : "Save settings"}
            </Button>
            <Button variant="secondary" onClick={() => router.push("/dashboard")}>
              Back
            </Button>
          </div>
        </div>
      </Card>

      <p className="mt-8 text-center text-xs text-slate-600">
        Pulse is a support tool, not a medical device or crisis service.
        If you&apos;re in crisis, contact a qualified professional.
      </p>
    </div>
  );
}
