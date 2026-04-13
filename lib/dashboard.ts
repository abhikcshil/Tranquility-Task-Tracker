import type { NoteListItem } from '@/services/noteService';
import type { TaskListItem } from '@/services/taskService';

export const WEEKLY_POINTS_GOAL = 100;

export type ProgressMetrics = {
  completed: number;
  total: number;
  percent: number;
};

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getWeekRange(today: Date): { start: Date; end: Date } {
  const start = getStartOfDay(today);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function computeDailyProgress(tasks: TaskListItem[], today: Date): ProgressMetrics {
  const dueTodayOneTimeTasks = tasks.filter(
    (task) => task.dueDate && isSameDay(task.dueDate, today) && !task.recurringRule,
  );
  const completed = dueTodayOneTimeTasks.filter((task) => task.isCompleted).length;
  const total = dueTodayOneTimeTasks.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : clampPercent((completed / total) * 100),
  };
}

export function computeWeeklyTaskProgress(tasks: TaskListItem[]): ProgressMetrics {
  const weeklyTasks = tasks.filter((task) => task.recurringRule?.type === 'weekly');
  const completed = weeklyTasks.filter((task) => task.isCompleted).length;
  const total = weeklyTasks.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : clampPercent((completed / total) * 100),
  };
}

export function computeWeeklyPointsProgress(pointsEarned: number, weeklyGoal = WEEKLY_POINTS_GOAL): ProgressMetrics {
  const safeGoal = weeklyGoal <= 0 ? WEEKLY_POINTS_GOAL : weeklyGoal;

  return {
    completed: pointsEarned,
    total: safeGoal,
    percent: clampPercent((pointsEarned / safeGoal) * 100),
  };
}

export function selectFocusTasks(tasks: TaskListItem[], today: Date, limit = 3): TaskListItem[] {
  const todayStart = getStartOfDay(today);
  const incomplete = tasks.filter((task) => !task.isCompleted);

  const ranked = [...incomplete].sort((a, b) => {
    const aDue = a.dueDate;
    const bDue = b.dueDate;

    const aOverdue = aDue ? aDue < todayStart : false;
    const bOverdue = bDue ? bDue < todayStart : false;
    if (aOverdue !== bOverdue) {
      return aOverdue ? -1 : 1;
    }

    const aToday = aDue ? isSameDay(aDue, todayStart) : false;
    const bToday = bDue ? isSameDay(bDue, todayStart) : false;
    if (aToday !== bToday) {
      return aToday ? -1 : 1;
    }

    if (aDue && bDue) {
      if (aDue.getTime() !== bDue.getTime()) {
        return aDue.getTime() - bDue.getTime();
      }
    } else if (aDue || bDue) {
      return aDue ? -1 : 1;
    }

    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return ranked.slice(0, limit);
}

export function getTodayTasks(tasks: TaskListItem[], today: Date): TaskListItem[] {
  return tasks.filter((task) => task.dueDate && isSameDay(task.dueDate, today));
}

export function getWeeklyTasks(tasks: TaskListItem[]): TaskListItem[] {
  return tasks.filter((task) => task.recurringRule?.type === 'weekly');
}

export function getPinnedNotesPreview(notes: NoteListItem[], limit = 3): NoteListItem[] {
  return notes.slice(0, limit);
}

