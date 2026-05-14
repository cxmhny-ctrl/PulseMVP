interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
      <p className="mt-4 text-sm text-slate-400">{message}</p>
    </div>
  );
}
