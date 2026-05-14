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
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        New task
      </h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex gap-4">
            <Input
              label="Scheduled start (optional)"
              type="datetime-local"
              autoComplete="off"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
            />
            <Input
              label="Scheduled end (optional)"
              type="datetime-local"
              autoComplete="off"
              value={scheduledEnd}
              onChange={(e) => setScheduledEnd(e.target.value)}
            />
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Channel: in-app only for now. SMS, notifications, and widgets
            coming later.
          </p>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Creating…" : "Create task"}
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
    </div>
  );
}
