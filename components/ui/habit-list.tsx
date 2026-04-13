import type { HabitListItem } from '@/services/habitService';
import { EmptyState } from '@/components/ui/empty-state';
import { completeHabitAction, uncompleteHabitAction } from '@/app/habits/actions';

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
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-zinc-100">{habit.title}</p>
              {habit.notes ? <p className="mt-1 text-xs text-zinc-400">{habit.notes}</p> : null}
            </div>
            <form action={habit.completedToday ? uncompleteHabitAction : completeHabitAction}>
              <input type="hidden" name="habitId" value={habit.id} />
              <button
                type="submit"
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
              >
                {habit.completedToday ? 'Undo today' : 'Complete'}
              </button>
            </form>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span>{habit.frequencyType}</span>
            <span>
              {habit.progress.completed} / {habit.progress.target} {habit.frequencyType === 'daily' ? 'today' : 'this week'}
            </span>
            <span>{habit.pointValue} pts</span>
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-300">🔥 {habit.streak} streak</span>
            {habit.progress.isComplete ? <span className="text-emerald-400">Target met</span> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
