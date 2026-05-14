interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-pulse-600" />
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
