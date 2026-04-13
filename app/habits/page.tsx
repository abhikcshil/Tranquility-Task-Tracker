import { PageShell } from '@/components/page-shell';
import { getHabits } from '@/services/habitService';

export default async function HabitsPage() {
  const habits = await getHabits();

  return (
    <PageShell title="Habits" description="Habit list from your database.">
      {habits.length === 0 ? (
        <p className="text-sm text-zinc-300">No habits yet.</p>
      ) : (
        <ul className="space-y-2 text-sm text-zinc-200">
          {habits.map((habit) => (
            <li key={habit.id} className="rounded-lg border border-zinc-800 p-3">
              <p className="font-medium">{habit.title}</p>
              {habit.notes ? <p className="text-xs text-zinc-400">{habit.notes}</p> : null}
              <p className="text-xs text-zinc-500">
                {habit.frequencyType} target: {habit.targetCount} • completions: {habit.completionCount}
              </p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
