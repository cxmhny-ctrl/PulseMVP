export default function StuckPath({
  currentStage,
  size = "sm",
  depth = false,
}: {
  currentStage?: "stuck" | "step" | "started";
  size?: "sm" | "lg";
  depth?: boolean;
}) {
  const cardSize = size === "lg" ? "h-16 w-16 rounded-2xl" : "h-10 w-10 rounded-xl";
  const dotSize = size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5";
  const stages = [
    { key: "stuck" as const, active: currentStage === "stuck" },
    { key: "step" as const, active: currentStage === "step" },
    { key: "started" as const, active: currentStage === "started" },
  ];

  const activeBg = depth ? "bg-sage/15 border-sage/25" : "bg-sage-light border-sage/30";
  const inactiveBg = depth ? "bg-white/5 border-white/10" : "bg-white border-charcoal-100";
  const activeText = depth ? "text-sage" : "text-sage";
  const inactiveText = depth ? "text-gray-500" : "text-charcoal-300";
  const connectorColor = depth ? "bg-white/10" : "bg-charcoal-100";
  const connectorActive = "bg-sage/30";

  return (
    <div className="flex items-center gap-2">
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex items-center gap-2">
          <div
            className={`flex ${cardSize} items-center justify-center border transition-all duration-500 ${
              stage.active ? `${activeBg} shadow-[inset_0_1px_0_rgba(74,155,127,0.15)]` : inactiveBg
            }`}
          >
            <span className={`${dotSize} rounded-full ${stage.active ? activeText : inactiveText}`}>
              {stage.active && (
                <span className={`block ${dotSize} rounded-full ${activeText} animate-breathe`} />
              )}
            </span>
          </div>
          {i < stages.length - 1 && (
            <div
              className={`h-px w-6 rounded-full transition-all duration-500 ${
                stage.active ? connectorActive : connectorColor
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
