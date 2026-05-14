interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading\u2026" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="pulse-orb h-12 w-12" />
      <p className="mt-5 text-sm text-charcoal-500">{message}</p>
    </div>
  );
}
