export default function PulseOrb({ size = "md", depth = false }: { size?: "sm" | "md" | "lg"; depth?: boolean }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };
  const dotSizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]}`}>
      <div
        className={`absolute inset-0 animate-pulse-ring rounded-full ${depth ? "bg-sage/25" : "bg-sage/15"}`}
        style={{ animationDelay: "0s" }}
      />
      <div
        className={`absolute inset-0 animate-pulse-ring rounded-full ${depth ? "bg-sage/18" : "bg-sage/10"}`}
        style={{ animationDelay: "0.8s" }}
      />
      <div
        className={`absolute inset-0 animate-pulse-ring rounded-full ${depth ? "bg-sage/10" : "bg-sage/5"}`}
        style={{ animationDelay: "1.6s" }}
      />
      <div className={`${dotSizes[size]} rounded-full ${depth ? "bg-sage" : "bg-sage"} animate-breathe z-10`} />
    </div>
  );
}
