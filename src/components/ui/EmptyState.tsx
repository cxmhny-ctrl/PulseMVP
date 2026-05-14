interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80">
        <span className="text-xl text-slate-400">—</span>
      </div>
      <h3 className="text-base font-semibold text-slate-200">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
