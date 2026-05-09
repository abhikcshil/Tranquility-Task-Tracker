import { createHabitAction } from '@/app/habits/actions';
import { CategorySelect } from '@/components/ui/category-select';
import { HabitList } from '@/components/ui/habit-list';
import { PointsStepper } from '@/components/ui/points-stepper';
import { SectionCard } from '@/components/ui/section-card';
import { SubmitButton } from '@/components/ui/submit-button';
import { getHabits } from '@/services/habitService';
import { getTaskCategories } from '@/services/taskService';

export default async function HabitsPage() {
  const [habits, categories] = await Promise.all([getHabits(), getTaskCategories()]);
  const completed = habits.filter((habit) => habit.progress.isComplete).length;

  return (
    <div className="space-y-4">
      <header className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-100">Habits</h1>
        <p className="text-sm text-zinc-400">
          Track today/week progress, streaks, and quick completion actions.
        </p>
        <p className="text-xs text-zinc-500">
          {completed}/{habits.length} targets met in the current period.
        </p>
      </header>

      <details className="animated-details group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-zinc-100">
          <span>+ Add Habit</span>
          <span className="text-xs text-zinc-400 group-open:hidden">Expand</span>
          <span className="hidden text-xs text-zinc-400 group-open:inline">Collapse</span>
        </summary>
        <form
          action={createHabitAction}
          className="details-content grid min-w-0 grid-cols-1 gap-3 border-t border-zinc-800 p-4 text-sm sm:grid-cols-2"
        >
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Habit title</span>
            <input
              required
              name="title"
              placeholder="Habit title"
              className="w-full min-w-0 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
            />
          </label>
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Category</span>
            <CategorySelect
              categories={categories}
              className="w-full min-w-0 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring disabled:cursor-not-allowed disabled:text-zinc-500"
            />
          </label>
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Frequency</span>
            <select
              name="frequencyType"
              defaultValue="daily"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Target count</span>
            <input
              name="targetCount"
              type="number"
              min={1}
              defaultValue={1}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
            />
          </label>
          <label className="min-w-0 space-y-1 sm:col-span-2">
            <span className="text-xs text-zinc-400">Points</span>
            <PointsStepper name="pointValue" defaultValue={5} />
          </label>
          <label className="min-w-0 space-y-1 sm:col-span-2">
            <span className="text-xs text-zinc-400">Notes</span>
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              rows={2}
              className="w-full min-w-0 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
            />
          </label>
          <SubmitButton
            pendingLabel="Adding..."
            className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300 transition active:scale-[0.98] sm:col-span-2"
          >
            Add habit
          </SubmitButton>
        </form>
      </details>

      <SectionCard
        title="Active habits"
        description="Quick taps for completion and streak visibility."
      >
        <HabitList habits={habits} categories={categories} showManage />
      </SectionCard>
    </div>
  );
}
