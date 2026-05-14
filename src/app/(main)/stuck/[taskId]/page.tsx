"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { formatLabel } from "@/lib/labels";

type Stage = "intake" | "generating" | "result" | "done";

const frictionOptions = [
  { value: "",                    label: "— pick one —" },
  { value: "too_vague",           label: "Too vague" },
  { value: "too_large",           label: "Too large" },
  { value: "unclear_first_step",  label: "Unclear first step" },
  { value: "overwhelm",           label: "Overwhelm" },
  { value: "emotional_avoidance", label: "Emotional avoidance" },
  { value: "boredom",             label: "Boredom" },
  { value: "perfectionism",       label: "Perfectionism" },
  { value: "energy_mismatch",     label: "Energy mismatch" },
  { value: "decision_fatigue",    label: "Decision fatigue" },
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

/* ── Stage progress dots ─────────────────────────────── */
function StageDots({ stage }: { stage: Stage }) {
  const stages: Stage[] = ["intake", "generating", "result", "done"];
  const idx = stages.indexOf(stage);
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={idx + 1} aria-valuemax={4}>
      {stages.map((s, i) => (
        <span
          key={s}
          className={`rounded-full transition-all duration-300
            ${i < idx  ? "h-1.5 w-1.5 bg-sage/50"
            : i === idx ? "h-2 w-6 bg-sage"
            : "h-1.5 w-1.5 bg-white/15"}`}
        />
      ))}
    </div>
  );
}

/* ── Pulse orb (dark, large) ─────────────────────────── */
function PulseOrbDark({ size = "lg" }: { size?: "md" | "lg" | "xl" }) {
  const dim = size === "xl" ? "h-28 w-28" : size === "lg" ? "h-20 w-20" : "h-14 w-14";
  const dot = size === "xl" ? "h-5 w-5" : size === "lg" ? "h-4 w-4" : "h-3 w-3";
  return (
    <div className={`relative flex items-center justify-center ${dim}`} aria-hidden>
      <span className="absolute inset-0 rounded-full bg-sage/20 animate-pulse-ring" style={{ animationDelay: "0s" }} />
      <span className="absolute inset-0 rounded-full bg-sage/12 animate-pulse-ring" style={{ animationDelay: "0.9s" }} />
      <span className="absolute inset-0 rounded-full bg-sage/6  animate-pulse-ring" style={{ animationDelay: "1.8s" }} />
      <span className={`${dot} rounded-full bg-sage animate-breathe z-10`} />
    </div>
  );
}

export default function StuckMode() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const [taskTitle,        setTaskTitle]        = useState<string | null>(null);
  const [stage,            setStage]            = useState<Stage>("intake");
  const [stuckDescription, setStuckDescription] = useState("");
  const [frictionType,     setFrictionType]     = useState("");
  const [sessionId,        setSessionId]        = useState<string | null>(null);
  const [step,             setStep]             = useState<StepResult | null>(null);
  const [showEasier,       setShowEasier]       = useState(false);
  const [error,            setError]            = useState<string | null>(null);

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
    setStage("generating"); setError(null);
    try {
      const body: Record<string, unknown> = { taskId };
      if (stuckDescription.trim()) body.stuckDescription = stuckDescription.trim();
      if (frictionType) body.frictionType = frictionType;
      const sRes = await fetch("/api/stuck-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!sRes.ok) throw new Error("Failed");
      const session = await sRes.json(); setSessionId(session.id);
      const gRes = await fetch(`/api/stuck-sessions/${session.id}/generate-step`, { method: "POST" });
      if (!gRes.ok) throw new Error("Failed");
      const result = await gRes.json(); setStep(result); setShowEasier(false); setStage("result");
    } catch { setError("Could not generate a step. Try again."); setStage("intake"); }
  }

  async function handleOutcome(outcome: string) {
    if (!sessionId) return;
    try {
      await fetch(`/api/stuck-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome }),
      });
      if (outcome === "started")        setStage("done");
      else if (outcome === "easier_version") setShowEasier(true);
      else router.push("/dashboard");
    } catch { setError("Could not save outcome."); }
  }

  if (!taskTitle && !error) return <LoadingState message="Loading task…" />;
  if (error && stage === "intake") return <ErrorState message={error} onRetry={loadTask} />;

  return (
    /* Full-screen dark immersive surface */
    <div className="min-h-screen bg-depth flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">

        {/* ── Header bar ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-5 w-5 items-center justify-center" aria-hidden>
              <span className="absolute inset-0 rounded-full border border-sage/40" />
              <span className="absolute inset-[3px] rounded-full border border-sage/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-sage animate-breathe" />
            </span>
            <span className="text-xs font-semibold text-white/50 tracking-tight">Pulse</span>
          </div>
          <StageDots stage={stage} />
        </div>

        {/* ── Task label ──────────────────────────────── */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30 mb-2">Stuck on</p>
          <p className="text-base font-medium text-white/70 text-balance">{taskTitle}</p>
        </div>

        {/* ── Central orb ─────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <PulseOrbDark size={stage === "generating" ? "xl" : "lg"} />
        </div>

        {/* ═══ INTAKE ════════════════════════════════════ */}
        {stage === "intake" && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="font-serif text-2xl font-bold text-white text-center leading-snug text-balance">
              What feels stuck?
            </h2>

            <textarea
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white/80 placeholder-white/25 focus:border-sage/30 focus:outline-none focus:ring-0 resize-none"
              rows={3}
              placeholder="Describe what's blocking you (optional)"
              value={stuckDescription}
              onChange={(e) => setStuckDescription(e.target.value)}
            />

            <select
              className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50 focus:border-sage/30 focus:outline-none focus:ring-0"
              value={frictionType}
              onChange={(e) => setFrictionType(e.target.value)}
            >
              {frictionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              className="w-full rounded-full bg-sage h-12 text-sm font-semibold text-white shadow-[0_2px_24px_rgba(74,155,127,0.35)] transition-all duration-200 hover:bg-sage-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
            >
              Find my next step
            </button>
          </div>
        )}

        {/* ═══ GENERATING ════════════════════════════════ */}
        {stage === "generating" && (
          <div className="py-4 flex flex-col items-center gap-4 animate-fade-in">
            <p className="text-sm text-white/40">Finding your next tiny step…</p>
          </div>
        )}

        {/* ═══ RESULT ════════════════════════════════════ */}
        {stage === "result" && step && (
          <div className="space-y-8 animate-enter">
            {/* The step — large, editorial */}
            <div className="text-center space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sage/60">
                {showEasier ? "Easier version" : "Your next step"}
              </p>
              <p className="font-serif text-2xl font-bold text-white leading-snug text-balance">
                {showEasier ? step.easierVersion : step.nextStep}
              </p>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-center gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-sage/50" aria-hidden />
                ~{step.estimatedMinutes} min
              </span>
              {step.frictionType && (
                <>
                  <span className="text-white/15" aria-hidden>·</span>
                  <span>{formatLabel(step.frictionType)}</span>
                </>
              )}
            </div>

            {/* Actions */}
            {!showEasier ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleOutcome("started")}
                  className="w-full rounded-full bg-sage h-12 text-sm font-semibold text-white shadow-[0_2px_24px_rgba(74,155,127,0.35)] transition-all duration-200 hover:bg-sage-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
                >
                  Start
                </button>
                <button
                  onClick={() => handleOutcome("easier_version")}
                  className="w-full rounded-full border border-white/12 bg-white/5 h-12 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white/80 active:scale-[0.97]"
                >
                  Easier version
                </button>
                <button
                  onClick={() => handleOutcome("not_now")}
                  className="w-full py-2.5 text-xs text-white/25 hover:text-white/45 transition-colors duration-150"
                >
                  Not now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleOutcome("started")}
                  className="w-full rounded-full bg-sage h-12 text-sm font-semibold text-white shadow-[0_2px_24px_rgba(74,155,127,0.35)] transition-all duration-200 hover:bg-sage-hover active:scale-[0.97]"
                >
                  Start easier version
                </button>
                <button
                  onClick={() => setShowEasier(false)}
                  className="w-full py-2.5 text-xs text-white/25 hover:text-white/45 transition-colors duration-150"
                >
                  Go back
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ DONE ══════════════════════════════════════ */}
        {stage === "done" && (
          <div className="space-y-6 text-center animate-enter">
            {/* Big checkmark area */}
            <div className="flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-sage/15" />
                <span className="absolute inset-0 rounded-full bg-sage/8 animate-pulse-ring" />
                <span className="font-serif text-2xl text-sage" aria-hidden>→</span>
              </div>
            </div>

            <div>
              <p className="font-serif text-2xl font-bold text-white">Started.</p>
              <p className="mt-2 text-sm text-white/40 leading-relaxed text-pretty">
                You&apos;re doing it. Come back when you need another step.
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-7 h-11 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white/80 active:scale-[0.97]"
            >
              Back to dashboard
            </button>
          </div>
        )}

        {error && stage !== "intake" && (
          <ErrorState message={error} />
        )}
      </div>
    </div>
  );
}
