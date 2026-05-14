export default function StuckPath({ currentStage }: { currentStage?: "stuck" | "step" | "started" }) {
  const stages = [
    { key: "stuck" as const, label: "Stuck", active: currentStage === "stuck" },
    { key: "step" as const, label: "Tiny step", active: currentStage === "step" },
    { key: "started" as const, label: "Started", active: currentStage === "started" },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-500 ${
                stage.active
                  ? "border-sage/30 bg-sage-light shadow-[inset_0_1px_0_rgba(74,155,127,0.15)]"
                  : "border-charcoal-100 bg-white"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  stage.active ? "text-sage" : "text-charcoal-300"
                }`}
              >
                {i + 1}
              </span>
            </div>
          </div>
          {i < stages.length - 1 && (
            <div
              className={`hidden sm:block h-px w-8 rounded-full transition-all duration-500 ${
                stage.active ? "bg-sage/30" : "bg-charcoal-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
