export default function PulseOrb({ size = "md", depth = false }: { size?: "sm" | "md" | "lg" | "xl"; depth?: boolean }) {
  const sizes: Record<string, string> = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
    xl: "h-32 w-32",
  };
  const dotSizes: Record<string, string> = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
    xl: "h-5 w-5",
  };
  const ringColor = depth ? "bg-sage/25" : "bg-sage/12";
  const ringColor2 = depth ? "bg-sage/15" : "bg-sage/8";
  const ringColor3 = depth ? "bg-sage/8" : "bg-sage/4";

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]}`}>
      <div className={`absolute inset-0 animate-pulse-ring rounded-full ${ringColor}`} style={{ animationDelay: "0s" }} />
      <div className={`absolute inset-0 animate-pulse-ring rounded-full ${ringColor2}`} style={{ animationDelay: "0.8s" }} />
      <div className={`absolute inset-0 animate-pulse-ring rounded-full ${ringColor3}`} style={{ animationDelay: "1.6s" }} />
      <div className={`${dotSizes[size]} rounded-full ${depth ? "bg-sage" : "bg-sage"} animate-breathe z-10`} />
    </div>
  );
}
