import type { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors duration-200 ease-out">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
          {description ? <p className="text-xs text-zinc-400">{description}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
