import { SectionCard } from '@/components/ui/section-card';
import { EmptyState } from '@/components/ui/empty-state';
import {
  archiveTaskAction,
  createTaskAction,
  toggleTaskCompletionAction,
  updateTaskAction,
} from '@/app/tasks/actions';
import { getTaskCategories, getTasks } from '@/services/taskService';

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

      <SectionCard title="Quick add" description="Capture a new task in a few taps.">
        <form action={createTaskAction} className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <input
            required
            name="title"
            placeholder="Task title"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
          />
          <input
            name="dueDate"
            type="date"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
          />
          <input
            name="reminderAt"
            type="datetime-local"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
          />
          <select
            name="categoryId"
            defaultValue=""
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            name="pointValue"
            type="number"
            min={0}
            defaultValue={5}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            rows={2}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none ring-sky-500/40 focus:ring sm:col-span-2"
          />

          <details className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs sm:col-span-2">
            <summary className="cursor-pointer text-zinc-400">Recurring rule (optional)</summary>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select
                name="recurrenceType"
                defaultValue="none"
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
              >
                {recurrenceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                name="recurrenceFrequency"
                type="number"
                min={1}
                placeholder="Frequency (e.g. 3 for weekly)"
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
              />
              <div className="sm:col-span-2">
                <p className="mb-1 text-zinc-500">
                  Weekdays selection (used only for weekdays mode)
                </p>
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
      </SectionCard>

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
                  borderLeftColor: task.category?.color ?? '#3f3f46',
                  borderLeftWidth: '3px',
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
                  <form
                    action={updateTaskAction}
                    className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2"
                  >
                    <input type="hidden" name="taskId" value={task.id} />
                    <input
                      required
                      name="title"
                      defaultValue={task.title}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    />
                    <input
                      type="date"
                      name="dueDate"
                      defaultValue={task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    />
                    <input
                      type="datetime-local"
                      name="reminderAt"
                      defaultValue={
                        task.reminderAt
                          ? new Date(
                              task.reminderAt.getTime() -
                                task.reminderAt.getTimezoneOffset() * 60000,
                            )
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    />
                    <select
                      name="categoryId"
                      defaultValue={task.categoryId ?? ''}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      name="pointValue"
                      type="number"
                      min={0}
                      defaultValue={task.pointValue}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    />
                    <textarea
                      name="notes"
                      defaultValue={task.notes ?? ''}
                      rows={2}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100 sm:col-span-2"
                    />
                    <select
                      name="recurrenceType"
                      defaultValue={task.recurringRule?.type ?? 'none'}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    >
                      {recurrenceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      name="recurrenceFrequency"
                      type="number"
                      min={1}
                      defaultValue={task.recurringRule?.frequency ?? ''}
                      placeholder="Frequency"
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    />
                    <div className="sm:col-span-2 flex flex-wrap gap-2">
                      {weekdayOptions.map((day) => (
                        <label
                          key={day.value}
                          className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1"
                        >
                          <input
                            type="checkbox"
                            name="weekdays"
                            value={day.value}
                            defaultChecked={task.recurringRule?.daysOfWeek
                              ?.split(',')
                              .includes(String(day.value))}
                          />
                          {day.label}
                        </label>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300 sm:col-span-2"
                    >
                      Save changes
                    </button>
                  </form>
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
                    borderLeftColor: task.category?.color ?? '#3f3f46',
                    borderLeftWidth: '3px',
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
