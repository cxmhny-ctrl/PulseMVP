interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading\u2026" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 animate-pulse-ring rounded-full bg-emerald-400/20" />
        <div className="h-5 w-5 rounded-full bg-emerald-400 animate-breathe" />
      </div>
      <p className="mt-5 text-sm text-slate-400">{message}</p>
    </div>
  );
}
