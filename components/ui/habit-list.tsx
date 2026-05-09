import {
  completeHabitAction,
  deleteHabitAction,
  uncompleteHabitAction,
  updateHabitAction,
} from '@/app/habits/actions';
import { ActionSubmitButton } from '@/components/ui/action-submit-button';
import { CategorySelect } from '@/components/ui/category-select';
import { EmptyState } from '@/components/ui/empty-state';
import { PointsStepper } from '@/components/ui/points-stepper';
import { SubmitButton } from '@/components/ui/submit-button';
import type { HabitListItem } from '@/services/habitService';
import type { CategoryOption } from '@/services/taskService';

type HabitListProps = {
  habits: HabitListItem[];
  categories?: CategoryOption[];
  showManage?: boolean;
};

export function HabitList({ habits, categories = [], showManage = false }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState title="No habits yet" message="Your habits will show here once they are added." />
    );
  }

  return (
    <ul className="space-y-2 text-sm">
      {habits.map((habit) => (
        <li
          key={habit.id}
          className={`pressable rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 ${habit.completedToday ? 'motion-soft-enter' : ''}`}
          style={{ borderLeftColor: habit.category?.color ?? '#3f3f46', borderLeftWidth: '3px' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-zinc-100">{habit.title}</p>
              {habit.notes ? <p className="mt-1 text-xs text-zinc-400">{habit.notes}</p> : null}
            </div>
            <form action={habit.completedToday ? uncompleteHabitAction : completeHabitAction}>
              <input type="hidden" name="habitId" value={habit.id} />
              <ActionSubmitButton
                pendingLabel="Saving..."
                haptic={habit.completedToday ? 'light' : 'success'}
                points={!habit.completedToday && !habit.progress.isComplete ? habit.pointValue : 0}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 transition hover:border-zinc-500 active:scale-[0.98]"
              >
                {habit.completedToday ? 'Undo today' : 'Complete'}
              </ActionSubmitButton>
            </form>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="habit-progress-fill h-full rounded-full bg-emerald-400"
              style={{
                width: `${Math.min(100, Math.round((habit.progress.completed / habit.progress.target) * 100))}%`,
              }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span>{habit.frequencyType}</span>
            <span>
              {habit.progress.completed} / {habit.progress.target}{' '}
              {habit.frequencyType === 'daily' ? 'today' : 'this week'}
            </span>
            <span>{habit.pointValue} pts</span>
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-300">
              {habit.streak} streak
            </span>
            {habit.progress.isComplete ? (
              <span className="text-emerald-400">Target met</span>
            ) : null}
          </div>

          {showManage ? (
            <details className="animated-details mt-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
              <summary className="cursor-pointer text-xs text-zinc-400">Edit habit</summary>
              <form
                action={updateHabitAction}
                className="details-content mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2"
              >
                <input type="hidden" name="habitId" value={habit.id} />
                <label className="space-y-1">
                  <span className="text-zinc-500">Habit title</span>
                  <input
                    required
                    name="title"
                    defaultValue={habit.title}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-zinc-500">Category</span>
                  <CategorySelect
                    categories={categories}
                    defaultValue={habit.categoryId}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-500"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-zinc-500">Frequency</span>
                  <select
                    name="frequencyType"
                    defaultValue={habit.frequencyType}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-zinc-500">Target count</span>
                  <input
                    name="targetCount"
                    type="number"
                    min={1}
                    defaultValue={habit.targetCount}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
                  />
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-zinc-500">Points</span>
                  <PointsStepper name="pointValue" defaultValue={habit.pointValue} compact />
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-zinc-500">Notes</span>
                  <textarea
                    name="notes"
                    defaultValue={habit.notes ?? ''}
                    rows={2}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
                  />
                </label>
                <SubmitButton
                  pendingLabel="Saving..."
                  className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300 transition active:scale-[0.98] sm:col-span-2"
                >
                  Save habit
                </SubmitButton>
              </form>
              <form action={deleteHabitAction} className="mt-2">
                <input type="hidden" name="habitId" value={habit.id} />
                <ActionSubmitButton
                  pendingLabel="Deleting..."
                  haptic="warning"
                  className="rounded-md border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs font-medium text-red-300 transition active:scale-[0.98]"
                >
                  Delete habit
                </ActionSubmitButton>
              </form>
            </details>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
