import type { HabitListItem } from '@/services/habitService';
import { EmptyState } from '@/components/ui/empty-state';

type HabitListProps = {
  habits: HabitListItem[];
};

export function HabitList({ habits }: HabitListProps) {
  if (habits.length === 0) {
    return <EmptyState title="No habits yet" message="Your habits will show here once they are added." />;
  }

  return (
    <ul className="space-y-2 text-sm">
      {habits.map((habit) => (
        <li
          key={habit.id}
          className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3"
          style={{ borderLeftColor: habit.category?.color ?? '#3f3f46', borderLeftWidth: '3px' }}
        >
          <p className="font-medium text-zinc-100">{habit.title}</p>
          {habit.notes ? <p className="mt-1 text-xs text-zinc-400">{habit.notes}</p> : null}
          <p className="mt-2 text-xs text-zinc-500">
            {habit.frequencyType} target {habit.targetCount} • completions {habit.completionCount}
          </p>
        </li>
      ))}
    </ul>
  );
}
