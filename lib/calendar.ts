import { formatDateKey, isSameLocalDay, startOfLocalDay } from '@/lib/dates';
import { appearsInToday } from '@/lib/recurrence';
import type { TaskListItem } from '@/services/taskService';

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
};

type CalendarTask = Pick<
  TaskListItem,
  'createdAt' | 'dueDate' | 'isArchived' | 'isCompleted' | 'recurringRule'
>;

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isWithinMonth(date: Date, monthDate: Date): boolean {
  return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth();
}

function calendarKey(date: Date): string {
  return formatDateKey(date);
}

export function getMonthCalendarDays(monthDate: Date, today = new Date()): CalendarDay[] {
  const monthStart = startOfMonth(monthDate);
  const gridStart = startOfLocalDay(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      isCurrentMonth: isWithinMonth(date, monthDate),
      isToday: isSameLocalDay(date, today),
    };
  });
}

function taskAppearsOnDay(task: CalendarTask, day: Date): boolean {
  if (task.isArchived) {
    return false;
  }

  if (task.dueDate && isSameLocalDay(task.dueDate, day)) {
    return true;
  }

  if (task.recurringRule && appearsInToday(task.recurringRule, day)) {
    return true;
  }

  return Boolean(task.isCompleted && !task.dueDate && isSameLocalDay(task.createdAt, day));
}

export function getTasksForCalendarDay<T extends CalendarTask>(tasks: T[], day: Date): T[] {
  return tasks.filter((task) => taskAppearsOnDay(task, day));
}

export function getTaskDatesForMonth(tasks: CalendarTask[], monthDate: Date): string[] {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const taskDates = new Set<string>();

  tasks.forEach((task) => {
    if (task.isArchived) {
      return;
    }

    if (task.dueDate && isWithinMonth(task.dueDate, monthDate)) {
      taskDates.add(calendarKey(task.dueDate));
    }

    if (task.isCompleted && !task.dueDate && isWithinMonth(task.createdAt, monthDate)) {
      taskDates.add(calendarKey(task.createdAt));
    }

    if (task.recurringRule?.type === 'daily' || task.recurringRule?.type === 'weekdays') {
      const cursor = new Date(monthStart);
      while (cursor <= monthEnd) {
        if (appearsInToday(task.recurringRule, cursor)) {
          taskDates.add(calendarKey(cursor));
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }
  });

  return [...taskDates].sort();
}

export function getPreviousMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function getNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function getCalendarDateKey(date: Date): string {
  return calendarKey(date);
}
