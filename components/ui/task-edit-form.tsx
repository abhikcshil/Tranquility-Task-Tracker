'use client';

import { useActionState } from 'react';
import { updateTaskWithStateAction, type TaskActionState } from '@/app/tasks/actions';
import { CategorySelect } from '@/components/ui/category-select';
import { PointsStepper } from '@/components/ui/points-stepper';
import type { CategoryOption } from '@/services/taskService';

type TaskEditFormProps = {
  task: {
    id: number;
    title: string;
    notes: string | null;
    categoryId: number | null;
    dueDateInput: string;
    dueTimeInput: string;
    reminderAtIso: string;
    pointValue: number;
    recurringRule: {
      type: string;
      frequency: number | null;
      daysOfWeek: string | null;
    } | null;
  };
  categories: CategoryOption[];
  recurrenceOptions: { value: string; label: string }[];
  weekdayOptions: { value: number; label: string }[];
};

export function TaskEditForm({
  task,
  categories,
  recurrenceOptions,
  weekdayOptions,
}: TaskEditFormProps) {
  const initialTaskActionState: TaskActionState = {
    status: 'idle',
    message: null,
  };
  const [state, formAction, isPending] = useActionState(
    updateTaskWithStateAction,
    initialTaskActionState,
  );

  return (
    <form action={formAction} className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
      <input type="hidden" name="taskId" value={task.id} />
      <input type="hidden" name="reminderAt" value={task.reminderAtIso} />
      <label className="space-y-1">
        <span className="text-zinc-500">Task title</span>
        <input
          required
          name="title"
          defaultValue={task.title}
          placeholder="Task title"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
        />
      </label>
      <label className="space-y-1">
        <span className="text-zinc-500">Due date</span>
        <input
          type="date"
          name="dueDate"
          aria-label="Due date, mm/dd/yyyy"
          defaultValue={task.dueDateInput}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
        />
      </label>
      <label className="space-y-1">
        <span className="text-zinc-500">Optional time</span>
        <input
          type="time"
          name="dueTime"
          defaultValue={task.dueTimeInput}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
        />
      </label>
      <label className="space-y-1">
        <span className="text-zinc-500">Category</span>
        <CategorySelect
          categories={categories}
          defaultValue={task.categoryId}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-500"
        />
      </label>
      <label className="space-y-1 sm:col-span-2">
        <span className="text-zinc-500">Points</span>
        <PointsStepper name="pointValue" defaultValue={task.pointValue} compact />
      </label>
      <label className="space-y-1 sm:col-span-2">
        <span className="text-zinc-500">Notes</span>
        <textarea
          name="notes"
          defaultValue={task.notes ?? ''}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
        />
      </label>
      <label className="space-y-1">
        <span className="text-zinc-500">Recurrence</span>
        <select
          name="recurrenceType"
          defaultValue={task.recurringRule?.type ?? 'none'}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
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
          defaultValue={task.recurringRule?.frequency ?? ''}
          placeholder="Frequency"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-zinc-100"
        />
      </label>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
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
      {state.message ? (
        <p
          className={
            state.status === 'error'
              ? 'text-xs text-red-300 sm:col-span-2'
              : 'text-xs text-emerald-300 sm:col-span-2'
          }
        >
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300 disabled:cursor-wait disabled:opacity-70 sm:col-span-2"
      >
        {isPending ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}
