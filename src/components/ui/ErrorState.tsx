interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-950/40 ring-1 ring-inset ring-rose-500/20">
        <span className="text-lg font-medium text-rose-400">!</span>
      </div>
      <p className="text-sm text-rose-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/40 transition-colors duration-200"
        >
          Try again
        </button>
      )}
    </div>
  );
}
