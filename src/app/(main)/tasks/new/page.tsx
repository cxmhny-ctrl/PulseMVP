"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";

const energyOptions = [
  { value: "low", label: "Low energy" },
  { value: "medium", label: "Medium energy" },
  { value: "high", label: "High energy" },
];

export default function NewTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [energy, setEnergy] = useState("medium");
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledEnd, setScheduledEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Task title is required."); return; }
    setSaving(true); setError(null);
    try {
      const body: Record<string, unknown> = { title: title.trim(), energyLevel: energy, preferredChannel: "in_app" };
      if (scheduledStart) body.scheduledStart = new Date(scheduledStart).toISOString();
      if (scheduledEnd) body.scheduledEnd = new Date(scheduledEnd).toISOString();
      const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        let msg = "Failed to create task.";
        try { const d = await res.json(); if (d?.error) msg = typeof d.error === "string" ? d.error : d.error.message || JSON.stringify(d.error); } catch { /* */ }
        throw new Error(msg);
      }
      router.push("/dashboard");
    } catch (err) { setError((err as Error).message || "Could not create task."); setSaving(false); }
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900">What needs a first step?</h1>
        <p className="mt-2 text-sm text-charcoal-500">Keep it rough. Pulse will make it smaller later.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          {/* Dominant title field */}
          <div className="mb-6">
            <Input
              label="Task"
              placeholder="e.g. Clean kitchen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={error ?? undefined}
            />
          </div>

          {/* Secondary: energy + scheduling */}
          <div className="pt-5 border-t border-charcoal-100 space-y-5">
            <Select
              label="How much energy does it need?"
              options={energyOptions}
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
            />

            <div>
              <p className="text-sm font-medium text-charcoal-900 mb-0.5">Scheduling</p>
              <p className="text-xs text-charcoal-500 mb-3">Optional. Pulse won&rsquo;t nudge you outside this window.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Start time" type="datetime-local" autoComplete="off" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} />
                <Input label="End time" type="datetime-local" autoComplete="off" value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button type="submit" disabled={saving} className="flex-1">{saving ? "Creating\u2026" : "Create task"}</Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/dashboard")}>Cancel</Button>
          </div>
        </form>
      </Card>

      <p className="mt-6 text-center text-xs text-charcoal-500">Channel: in-app only for now. SMS, notifications, and widgets coming later.</p>
    </div>
  );
}
