"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PulseOrb from "@/components/PulseOrb";
import StuckPath from "@/components/StuckPath";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { formatLabel } from "@/lib/labels";

type Stage = "intake" | "generating" | "result" | "done";

const frictionOptions = [
  { value: "", label: "\u2014 or pick one \u2014" },
  { value: "too_vague", label: "Too vague" },
  { value: "too_large", label: "Too large" },
  { value: "unclear_first_step", label: "Unclear first step" },
  { value: "overwhelm", label: "Overwhelm" },
  { value: "emotional_avoidance", label: "Emotional avoidance" },
  { value: "boredom", label: "Boredom" },
  { value: "perfectionism", label: "Perfectionism" },
  { value: "energy_mismatch", label: "Energy mismatch" },
  { value: "decision_fatigue", label: "Decision fatigue" },
  { value: "transition_friction", label: "Transition friction" },
];

interface StepResult {
  sessionId: string;
  nextStep: string;
  easierVersion: string;
  estimatedMinutes: number;
  rationale: string;
  frictionType: string;
}

export default function StuckMode() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("intake");
  const [stuckDescription, setStuckDescription] = useState("");
  const [frictionType, setFrictionType] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<StepResult | null>(null);
  const [showEasier, setShowEasier] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTask = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed");
      const tasks = await res.json();
      const task = tasks.find((t: { id: string }) => t.id === taskId);
      if (task) setTaskTitle(task.title);
    } catch { setError("Could not load task."); }
  }, [taskId]);

  useEffect(() => { loadTask(); }, [loadTask]);

  async function handleGenerate() {
    setStage("generating");
    setError(null);
    try {
      const body: Record<string, unknown> = { taskId };
      if (stuckDescription.trim()) body.stuckDescription = stuckDescription.trim();
      if (frictionType) body.frictionType = frictionType;
      const sRes = await fetch("/api/stuck-sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!sRes.ok) throw new Error("Failed to create session");
      const session = await sRes.json();
      setSessionId(session.id);
      const gRes = await fetch(`/api/stuck-sessions/${session.id}/generate-step`, { method: "POST" });
      if (!gRes.ok) throw new Error("Failed to generate step");
      const result = await gRes.json();
      setStep(result);
      setShowEasier(false);
      setStage("result");
    } catch { setError("Could not generate a step. Try again."); setStage("intake"); }
  }

  async function handleOutcome(outcome: string) {
    if (!sessionId) return;
    try {
      await fetch(`/api/stuck-sessions/${sessionId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ outcome }) });
      if (outcome === "started") { setStage("done"); }
      else if (outcome === "easier_version") { setShowEasier(true); }
      else { router.push("/dashboard"); }
    } catch { setError("Could not save outcome."); }
  }

  if (!taskTitle && !error) return <LoadingState message="Loading task\u2026" />;
  if (error && stage === "intake") return <ErrorState message={error} onRetry={loadTask} />;

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      {/* Depth overlay for focus mode */}
      <div className="pointer-events-none fixed inset-0 bg-depth/60 z-0" />
      <div className="relative z-10">
        {/* Task context */}
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-depth-border mb-2">Stuck on</p>
          <h1 className="text-lg font-semibold text-white">{taskTitle}</h1>
        </div>

        {/* Stuck path */}
        <div className="mb-8 flex justify-center">
          <StuckPath currentStage={stage === "done" ? "started" : stage === "result" ? "step" : "stuck"} />
        </div>

        {/* Large PulseOrb - focus anchor */}
        <div className="flex justify-center mb-8">
          <PulseOrb size="lg" depth />
        </div>

        {stage === "intake" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-white text-center">What feels stuck?</p>
            <textarea
              className="w-full rounded-xl border border-depth-border bg-depth px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-sage/30 focus:outline-none focus:ring-0 resize-none"
              rows={2}
              placeholder="Describe what's blocking you (optional)"
              value={stuckDescription}
              onChange={(e) => setStuckDescription(e.target.value)}
            />
            <select
              className="block w-full rounded-xl border border-depth-border bg-depth px-4 py-2.5 text-sm text-white focus:border-sage/30 focus:outline-none focus:ring-0"
              value={frictionType}
              onChange={(e) => setFrictionType(e.target.value)}
            >
              {frictionOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-depth-surface text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pt-2">
              <Button onClick={handleGenerate} className="w-full">Find my next step</Button>
            </div>
          </div>
        )}

        {stage === "generating" && (
          <div className="py-10 flex flex-col items-center gap-5">
            <PulseOrb size="md" depth />
            <p className="text-sm text-gray-400">Finding your next tiny step\u2026</p>
          </div>
        )}

        {stage === "result" && step && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-sage/70 mb-3">
                {showEasier ? "Easier version" : "Your next step"}
              </p>
              <p className="text-xl font-semibold leading-relaxed text-white text-balance">
                {showEasier ? step.easierVersion : step.nextStep}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sage/60" />
                ~{step.estimatedMinutes} min
              </span>
              {step.frictionType && (<><span className="text-depth-border">&middot;</span><span>{formatLabel(step.frictionType)}</span></>)}
            </div>
            {!showEasier && (
              <div className="space-y-2">
                <Button onClick={() => handleOutcome("started")} className="w-full">Start</Button>
                <Button variant="secondary" onClick={() => handleOutcome("easier_version")} className="w-full">Easier version</Button>
                <button onClick={() => handleOutcome("not_now")} className="w-full py-2 text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200">Not now</button>
              </div>
            )}
            {showEasier && (
              <div className="space-y-2">
                <Button onClick={() => handleOutcome("started")} className="w-full">Start easier version</Button>
                <button onClick={() => setShowEasier(false)} className="w-full py-2 text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200">Go back</button>
              </div>
            )}
          </div>
        )}

        {stage === "done" && (
          <div className="space-y-5 text-center">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 ring-1 ring-inset ring-sage/20">
                <span className="text-lg text-sage">&rarr;</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-white">Started</p>
              <p className="mt-1 text-sm text-gray-400">You&apos;re doing it. Come back when you&apos;re ready.</p>
            </div>
            <Button onClick={() => router.push("/dashboard")} variant="secondary">Back to dashboard</Button>
          </div>
        )}

        {error && stage !== "intake" && <ErrorState message={error} />}
      </div>
    </div>
  );
}
