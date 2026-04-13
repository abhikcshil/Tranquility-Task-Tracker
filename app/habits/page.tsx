import { HabitList } from '@/components/ui/habit-list';
import { SectionCard } from '@/components/ui/section-card';
import { getHabits } from '@/services/habitService';

export default async function HabitsPage() {
  const habits = await getHabits();

  return (
    <div className="space-y-4">
      <header className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-100">Habits</h1>
        <p className="text-sm text-zinc-400">Current frequency targets and completion totals.</p>
      </header>

      <SectionCard title="Habit overview" description="Simple weekly and daily habit tracking.">
        <HabitList habits={habits} />
      </SectionCard>
    </div>
  );
}
