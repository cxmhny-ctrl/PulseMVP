interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-coral-light ring-1 ring-inset ring-coral/20">
        <span className="text-lg font-medium text-coral">!</span>
      </div>
      <p className="text-sm text-coral">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl px-4 py-2 text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100/40 transition-colors duration-200"
        >
          Try again
        </button>
      )}
    </div>
  );
}
