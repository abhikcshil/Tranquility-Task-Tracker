type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 p-4 text-sm">
      <p className="font-medium text-zinc-200">{title}</p>
      <p className="mt-1 text-zinc-400">{message}</p>
    </div>
  );
}
