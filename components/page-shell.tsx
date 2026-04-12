import type { ReactNode } from 'react';

type PageShellProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-100">{title}</h1>
        <p className="text-sm text-zinc-400">{description}</p>
      </header>
      {children}
    </section>
  );
}
