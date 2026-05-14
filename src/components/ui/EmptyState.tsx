interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-100/60 ring-1 ring-inset ring-charcoal-300/40">
        <span className="text-xl font-light text-charcoal-300">&mdash;</span>
      </div>
      <h3 className="text-base font-semibold text-charcoal-900">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm text-charcoal-500">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
