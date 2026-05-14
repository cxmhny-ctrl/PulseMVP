"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import Select from "@/components/ui/Select";

type Stage = "intake" | "generating" | "result" | "done";

const frictionOptions = [
  { value: "", label: "— or pick one —" },
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
    } catch {
      setError("Could not load task.");
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  async function handleGenerate() {
    setStage("generating");
    setError(null);
    try {
      const body: Record<string, unknown> = { taskId };
      if (stuckDescription.trim()) body.stuckDescription = stuckDescription.trim();
      if (frictionType) body.frictionType = frictionType;

      const sRes = await fetch("/api/stuck-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!sRes.ok) throw new Error("Failed to create session");
      const session = await sRes.json();
      setSessionId(session.id);

      const gRes = await fetch(`/api/stuck-sessions/${session.id}/generate-step`, {
        method: "POST",
      });
      if (!gRes.ok) throw new Error("Failed to generate step");
      const result = await gRes.json();
      setStep(result);
      setShowEasier(false);
      setStage("result");
    } catch {
      setError("Could not generate a step. Try again.");
      setStage("intake");
    }
  }

  async function handleOutcome(outcome: string) {
    if (!sessionId) return;
    try {
      await fetch(`/api/stuck-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome }),
      });
      if (outcome === "started") {
        setStage("done");
      } else if (outcome === "easier_version") {
        setShowEasier(true);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Could not save outcome.");
    }
  }

  if (!taskTitle && !error) return <LoadingState message="Loading task…" />;
  if (error && stage === "intake") return <ErrorState message={error} onRetry={loadTask} />;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Stuck Mode
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {taskTitle}
      </p>

      <Card>
        {stage === "intake" && (
          <div className="space-y-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              What feels stuck?
            </p>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 focus:outline-none resize-none"
              rows={2}
              placeholder="Describe what's blocking you (optional)"
              value={stuckDescription}
              onChange={(e) => setStuckDescription(e.target.value)}
            />
            <Select
              label="Friction type"
              options={frictionOptions}
              value={frictionType}
              onChange={(e) => setFrictionType(e.target.value)}
            />
            <Button onClick={handleGenerate} className="w-full">
              Find my next step
            </Button>
          </div>
        )}

        {stage === "generating" && (
          <LoadingState message="Finding your next tiny step…" />
        )}

        {stage === "result" && step && (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Next step
              </p>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                {showEasier ? step.easierVersion : step.nextStep}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>~{step.estimatedMinutes} min</span>
              <span>&middot;</span>
              <span>{step.frictionType.replace(/_/g, " ")}</span>
            </div>

            {!showEasier && (
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleOutcome("started")} className="w-full">
                  Start
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleOutcome("easier_version")}
                >
                  Easier version
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleOutcome("not_now")}
                >
                  Not now
                </Button>
              </div>
            )}

            {showEasier && (
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleOutcome("started")} className="w-full">
                  Start easier version
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowEasier(false)}
                >
                  Go back
                </Button>
              </div>
            )}
          </div>
        )}

        {stage === "done" && (
          <div className="space-y-4 text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Starting a 2-minute pulse.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Stop when the timer ends.
            </p>
            <Button onClick={() => router.push("/dashboard")} variant="secondary">
              Back to dashboard
            </Button>
          </div>
        )}

        {error && stage !== "intake" && <ErrorState message={error} />}
      </Card>
    </div>
  );
}
