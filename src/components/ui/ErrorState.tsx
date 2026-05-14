interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-950/60">
        <span className="text-lg text-rose-400">!</span>
      </div>
      <p className="text-sm text-rose-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
