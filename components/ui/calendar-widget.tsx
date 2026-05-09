'use client';

import { useMemo, useState } from 'react';
import {
  getCalendarDateKey,
  getMonthCalendarDays,
  getNextMonth,
  getPreviousMonth,
  getTaskDatesForMonth,
  getTasksForCalendarDay,
} from '@/lib/calendar';
import {
  formatCalendarDayLabel,
  formatCalendarMonthLabel,
  formatCalendarSelectLabel,
} from '@/lib/dates';
import { getTaskCategoryCueColor, getTaskCompletionCueColor } from '@/lib/task-visuals';

type CalendarWidgetTask = {
  id: number;
  title: string;
  dueDate: string | null;
  createdAt: string;
  isArchived: boolean;
  isCompleted: boolean;
  pointValue: number;
  category: {
    name: string;
    color: string;
  } | null;
  recurringRule: {
    type: string;
    frequency: number | null;
    daysOfWeek: string | null;
  } | null;
  weeklyProgress: {
    completed: number;
    target: number;
  } | null;
};

type CalendarWidgetProps = {
  tasks: CalendarWidgetTask[];
};

function toDateTask(task: CalendarWidgetTask) {
  return {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    createdAt: new Date(task.createdAt),
  };
}

export function CalendarWidget({ tasks }: CalendarWidgetProps) {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState(() => today);

  const dateTasks = useMemo(() => tasks.map(toDateTask), [tasks]);
  const calendarDays = getMonthCalendarDays(visibleMonth, today);
  const taskDateKeys = new Set(getTaskDatesForMonth(dateTasks, visibleMonth));
  const selectedTasks = getTasksForCalendarDay(dateTasks, selectedDay);
  const selectedDayLabel = formatCalendarDayLabel(selectedDay);

  return (
    <details className="group rounded-2xl border border-zinc-800 bg-zinc-900">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-zinc-100">
        <span>View task calendar</span>
        <span className="text-xs text-zinc-400 group-open:hidden">Open</span>
        <span className="hidden text-xs text-zinc-400 group-open:inline">Close</span>
      </summary>
      <div className="space-y-3 border-t border-zinc-800 p-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setVisibleMonth((month) => getPreviousMonth(month))}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
            aria-label="Previous month"
          >
            Prev
          </button>
          <p className="text-sm font-medium text-zinc-100">
            {formatCalendarMonthLabel(visibleMonth)}
          </p>
          <button
            type="button"
            onClick={() => setVisibleMonth((month) => getNextMonth(month))}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
            aria-label="Next month"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-500">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const key = getCalendarDateKey(day.date);
            const isSelected = getCalendarDateKey(selectedDay) === key;
            const hasTasks = taskDateKeys.has(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(day.date)}
                className={[
                  'relative aspect-square rounded-lg border text-xs transition',
                  day.isCurrentMonth ? 'text-zinc-100' : 'text-zinc-600',
                  day.isToday
                    ? 'border-sky-500/70 bg-sky-500/10'
                    : 'border-zinc-800 bg-zinc-950/60',
                  isSelected ? 'ring-1 ring-sky-300' : '',
                ].join(' ')}
                aria-label={`Select ${formatCalendarSelectLabel(day.date)}`}
              >
                {day.date.getDate()}
                {hasTasks ? (
                  <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-300" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {selectedDayLabel}
          </p>
          {selectedTasks.length === 0 ? (
            <p className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-400">
              No tasks on this day.
            </p>
          ) : (
            <ul className="space-y-2">
              {selectedTasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm"
                  style={{
                    borderLeftColor: getTaskCompletionCueColor(task),
                    borderLeftWidth: '3px',
                    borderRightColor: getTaskCategoryCueColor(task),
                    borderRightWidth: '3px',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-zinc-100">{task.title}</span>
                    <span
                      className={
                        task.isCompleted ? 'text-xs text-emerald-300' : 'text-xs text-yellow-300'
                      }
                    >
                      {task.isCompleted ? 'Done' : 'Open'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {task.category?.name ?? 'Uncategorized'} - {task.pointValue} pts
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </details>
  );
}
