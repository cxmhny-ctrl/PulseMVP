"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

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
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        energyLevel: energy,
        preferredChannel: "in_app",
      };
      if (scheduledStart) body.scheduledStart = new Date(scheduledStart).toISOString();
      if (scheduledEnd) body.scheduledEnd = new Date(scheduledEnd).toISOString();

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let msg = "Failed to create task.";
        try {
          const errData = await res.json();
          if (errData?.error) {
            msg =
              typeof errData.error === "string"
                ? errData.error
                : errData.error.message || JSON.stringify(errData.error);
          }
        } catch { /* use default */ }
        throw new Error(msg);
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("Task creation failed:", err);
      setError((err as Error).message || "Could not create task. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-slate-100 mb-6">
        New task
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          {/* What section */}
          <div className="space-y-4 pb-5 border-b border-slate-800/60">
            <Input
              label="What do you want to start?"
              placeholder="e.g. Clean kitchen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={error ?? undefined}
            />
            <Select
              label="How much energy does it need?"
              options={energyOptions}
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
            />
          </div>

          {/* Optional scheduling section */}
          <div className="space-y-3 py-5 border-b border-slate-800/60">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Scheduling
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Optional. Pulse won&apos;t nudge you outside this window.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start time"
                type="datetime-local"
                autoComplete="off"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
              />
              <Input
                label="End time"
                type="datetime-local"
                autoComplete="off"
                value={scheduledEnd}
                onChange={(e) => setScheduledEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-5 flex gap-3">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Creating\u2026" : "Create task"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-600">
        Channel: in-app only for now. SMS, notifications, and widgets coming later.
      </p>
    </div>
  );
}
