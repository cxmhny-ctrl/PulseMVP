"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

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

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [supportStyle, setSupportStyle] = useState("gentle");
  const [sensitivity, setSensitivity] = useState("medium");
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");
  const [firstTask, setFirstTask] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    setSaving(true);
    try {
      await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supportStyle,
          stuckSensitivity: sensitivity,
          quietHoursStart: quietStart,
          quietHoursEnd: quietEnd,
        }),
      });

      if (firstTask.trim()) {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: firstTask.trim() }),
        });
      }

      router.push("/dashboard");
    } catch {
      setSaving(false);
    }
  }

  const steps = [
    <div key={0} className="space-y-3">
      <h2 className="text-2xl font-bold text-slate-100">
        Welcome to Pulse
      </h2>
      <p className="text-slate-300 leading-relaxed">
        Pulse helps you start when you get stuck. No complex planning. No
        shame. The next tiny step.
      </p>
      <p className="text-sm text-slate-400">
        Pulse is a support tool, not a medical device or crisis service.
      </p>
    </div>,
    <div key={1} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">
        How should Pulse talk to you?
      </h2>
      <Select
        label="Support style"
        options={styleOptions}
        value={supportStyle}
        onChange={(e) => setSupportStyle(e.target.value)}
      />
    </div>,
    <div key={2} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">
        How often should Pulse check in?
      </h2>
      <Select
        label="Stuck sensitivity"
        options={sensitivityOptions}
        value={sensitivity}
        onChange={(e) => setSensitivity(e.target.value)}
      />
    </div>,
    <div key={3} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">
        Quiet hours
      </h2>
      <p className="text-sm text-slate-400">
        Pulse won&apos;t nudge you during these hours.
      </p>
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
    </div>,
    <div key={4} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">
        Say one thing you tend to get stuck starting.
      </h2>
      <p className="text-sm text-slate-400">
        You can change this anytime.
      </p>
      <Input
        label="First task"
        placeholder="e.g. Clean kitchen, send email, do laundry"
        value={firstTask}
        onChange={(e) => setFirstTask(e.target.value)}
      />
    </div>,
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      {/* Ambient glow behind card */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-emerald-500/[0.03] blur-3xl animate-glow" />
      </div>

      <Card className="relative w-full max-w-md">
        <div className="space-y-6">{steps[step]}</div>

        <div className="mt-8 flex justify-between">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={handleFinish} disabled={saving}>
              {saving ? "Saving\u2026" : "Set up Pulse"}
            </Button>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-emerald-500"
                  : i < step
                  ? "w-1.5 bg-emerald-500/40"
                  : "w-1.5 bg-slate-800"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
