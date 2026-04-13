import { HabitList } from '@/components/ui/habit-list';
import { SectionCard } from '@/components/ui/section-card';
import { getHabits } from '@/services/habitService';

export default async function HabitsPage() {
  const habits = await getHabits();
  const completed = habits.filter((habit) => habit.progress.isComplete).length;

  return (
    <div className="space-y-4">
      <header className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-100">Habits</h1>
        <p className="text-sm text-zinc-400">Track today/week progress, streaks, and quick completion actions.</p>
        <p className="text-xs text-zinc-500">
          {completed}/{habits.length} targets met in the current period.
        </p>
      </header>

      <SectionCard title="Active habits" description="Quick taps for completion and streak visibility.">
        <HabitList habits={habits} />
      </SectionCard>
    </div>
  );
}
