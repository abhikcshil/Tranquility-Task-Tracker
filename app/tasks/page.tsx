import { SectionCard } from '@/components/ui/section-card';
import { EmptyState } from '@/components/ui/empty-state';
import { CategorySelect } from '@/components/ui/category-select';
import { PointsStepper } from '@/components/ui/points-stepper';
import { TaskEditForm } from '@/components/ui/task-edit-form';
import {
  archiveTaskAction,
  createTaskAction,
  toggleTaskCompletionAction,
} from '@/app/tasks/actions';
import { formatDateInputValue } from '@/lib/dates';
import { getTaskCategoryCueColor, getTaskCompletionCueColor } from '@/lib/task-visuals';
import { getTaskCategories, getTasks } from '@/services/taskService';

export const dynamic = 'force-dynamic';

const recurrenceOptions = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekly', label: 'Weekly (flex)' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const weekdayOptions = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
];

function formatTimeInputValue(date: Date | null): string {
  if (!date || (date.getHours() === 0 && date.getMinutes() === 0)) {
    return '';
  }

  return [date.getHours(), date.getMinutes()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export default async function TasksPage() {
  const [tasks, categories] = await Promise.all([getTasks(), getTaskCategories()]);

  const activeTasks = tasks.filter(
    (task) => !task.isCompleted || task.recurringRule?.type === 'weekly',
  );
  const completedTasks = tasks.filter(
    (task) => task.isCompleted && task.recurringRule?.type !== 'weekly',
  );

  return (
    <div className="space-y-4">
      <header className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-100">Tasks</h1>
        <p className="text-sm text-zinc-400">
          Create, complete, and maintain your local task list.
        </p>
      </header>

      <details className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-zinc-100">
          <span>+ Add Task</span>
          <span className="text-xs text-zinc-400 group-open:hidden">Expand</span>
          <span className="hidden text-xs text-zinc-400 group-open:inline">Collapse</span>
        </summary>
        <form
          action={createTaskAction}
          className="grid min-w-0 grid-cols-1 gap-3 border-t border-zinc-800 p-4 text-sm sm:grid-cols-2"
        >
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Task title</span>
            <input
              required
              name="title"
              placeholder="Task title"
              className="w-full min-w-0 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
            />
          </label>
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Due date</span>
            <input
              name="dueDate"
              type="date"
              aria-label="Due date, mm/dd/yyyy"
              className="block w-full min-w-0 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
            />
          </label>
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Optional time</span>
            <input
              name="dueTime"
              type="time"
              aria-label="Optional due time"
              className="block w-full min-w-0 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
            />
          </label>
          <label className="min-w-0 space-y-1">
            <span className="text-xs text-zinc-400">Category</span>
            <CategorySelect
              categories={categories}
              className="w-full min-w-0 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring disabled:cursor-not-allowed disabled:text-zinc-500"
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

          <details className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs sm:col-span-2">
            <summary className="cursor-pointer text-zinc-400">Recurrence (optional)</summary>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-zinc-500">Recurrence</span>
                <select
                  name="recurrenceType"
                  defaultValue="none"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-zinc-100"
                >
                  {recurrenceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-zinc-500">Frequency</span>
                <input
                  name="recurrenceFrequency"
                  type="number"
                  min={1}
                  placeholder="e.g. 3 for weekly"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-zinc-100"
                />
              </label>
              <div className="sm:col-span-2">
                <p className="mb-1 text-zinc-500">Weekdays</p>
                <div className="flex flex-wrap gap-2">
                  {weekdayOptions.map((day) => (
                    <label
                      key={day.value}
                      className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1"
                    >
                      <input type="checkbox" name="weekdays" value={day.value} />
                      {day.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </details>

          <button
            type="submit"
            className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300 sm:col-span-2"
          >
            Add task
          </button>
        </form>
      </details>

      <SectionCard title="Active tasks" description="Open items that still need action.">
        {activeTasks.length === 0 ? (
          <EmptyState title="No active tasks" message="Add something quick above to get started." />
        ) : (
          <ul className="space-y-2">
            {activeTasks.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3"
                style={{
                  borderLeftColor: getTaskCompletionCueColor(task),
                  borderLeftWidth: '3px',
                  borderRightColor: getTaskCategoryCueColor(task),
                  borderRightWidth: '3px',
                }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-100">{task.title}</p>
                  <div className="flex gap-2">
                    <form action={toggleTaskCompletionAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
                      >
                        {task.recurringRule?.type === 'weekly' ? 'Log today' : 'Complete'}
                      </button>
                    </form>
                    <form action={archiveTaskAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400"
                      >
                        Archive
                      </button>
                    </form>
                  </div>
                </div>
                {task.weeklyProgress ? (
                  <p className="mb-2 text-xs text-zinc-400">
                    {task.weeklyProgress.completed} / {task.weeklyProgress.target} this week
                  </p>
                ) : null}
                <details className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                  <summary className="cursor-pointer text-xs text-zinc-400">Edit task</summary>
                  <TaskEditForm
                    task={{
                      id: task.id,
                      title: task.title,
                      notes: task.notes,
                      categoryId: task.categoryId,
                      dueDateInput: task.dueDate ? formatDateInputValue(task.dueDate) : '',
                      dueTimeInput: formatTimeInputValue(task.dueDate),
                      reminderAtIso: task.reminderAt ? task.reminderAt.toISOString() : '',
                      pointValue: task.pointValue,
                      recurringRule: task.recurringRule,
                    }}
                    categories={categories}
                    recurrenceOptions={recurrenceOptions}
                    weekdayOptions={weekdayOptions}
                  />
                </details>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Completed tasks" description="Recently finished items.">
        {completedTasks.length === 0 ? (
          <EmptyState title="No completed tasks" message="Completed tasks will appear here." />
        ) : (
          <details open className="space-y-2">
            <summary className="cursor-pointer text-sm text-zinc-400">
              Show completed ({completedTasks.length})
            </summary>
            <ul className="space-y-2">
              {completedTasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3"
                  style={{
                    borderLeftColor: getTaskCompletionCueColor(task),
                    borderLeftWidth: '3px',
                    borderRightColor: getTaskCategoryCueColor(task),
                    borderRightWidth: '3px',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-200 line-through">{task.title}</p>
                    <form action={toggleTaskCompletionAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                      >
                        Mark incomplete
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </SectionCard>
    </div>
  );
}
