interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-2xl mb-3">!</div>
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-pulse-600 hover:text-pulse-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
