import { isDueOnDay } from '@/lib/dates';
import { appearsInMonth, appearsInToday, appearsInWeek, appearsInYear } from '@/lib/recurrence';
import { getTaskVisualStatus } from '@/lib/task-visuals';
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

function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getWeekRange(today: Date): { start: Date; end: Date } {
  const start = startOfLocalWeek(today);
  const end = endOfLocalWeek(today);

  return { start, end };
}

export function computeDailyProgress(tasks: TaskListItem[], today: Date): ProgressMetrics {
  const dueTodayTasks = tasks.filter((task) => isTaskDueToday(task, today));
  const completed = dueTodayTasks.filter((task) => task.isCompleted).length;
  const total = dueTodayTasks.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : clampPercent((completed / total) * 100),
  };
}

export function computeWeeklyTaskProgress(tasks: TaskListItem[]): ProgressMetrics {
  const recurringWeekly = tasks.filter((task) => task.recurringRule?.type === 'weekly');

  const completed = recurringWeekly.reduce(
    (sum, task) => sum + (task.weeklyProgress?.completed ?? 0),
    0,
  );
  const total = recurringWeekly.reduce((sum, task) => sum + (task.weeklyProgress?.target ?? 1), 0);

  return {
    completed,
    total,
    percent: total === 0 ? 0 : clampPercent((completed / total) * 100),
  };
}

export function computeWeeklyPointsProgress(
  pointsEarned: number,
  weeklyGoal = WEEKLY_POINTS_GOAL,
): ProgressMetrics {
  const safeGoal = weeklyGoal <= 0 ? WEEKLY_POINTS_GOAL : weeklyGoal;

  return {
    completed: pointsEarned,
    total: safeGoal,
    percent: clampPercent((pointsEarned / safeGoal) * 100),
  };
}

export function selectFocusTasks(tasks: TaskListItem[], today: Date, limit = 3): TaskListItem[] {
  const todayStart = getStartOfDay(today);
  const incomplete = tasks.filter((task) => getTaskVisualStatus(task) === 'incomplete');

  const ranked = [...incomplete].sort((a, b) => {
    const aDue = a.dueDate;
    const bDue = b.dueDate;

    const aOverdue = aDue ? aDue < todayStart : false;
    const bOverdue = bDue ? bDue < todayStart : false;
    if (aOverdue !== bOverdue) {
      return aOverdue ? -1 : 1;
    }

    const aToday = aDue ? isDueOnDay(aDue, todayStart) : false;
    const bToday = bDue ? isDueOnDay(bDue, todayStart) : false;
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
  return tasks.filter((task) => {
    if (!task.recurringRule) {
      return Boolean(task.dueDate && isDueOnDay(task.dueDate, today));
    }

    return appearsInToday(task.recurringRule, today);
  });
}

export function getActiveTodayTasks(tasks: TaskListItem[], today: Date): TaskListItem[] {
  return getTodayTasks(tasks, today).filter((task) => !task.isCompleted && !task.isArchived);
}

export function getDashboardTodayTasks(tasks: TaskListItem[], today: Date): TaskListItem[] {
  return getTodayTasks(tasks, today)
    .filter((task) => !task.isArchived)
    .sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }

      const aDue = a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bDue = b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      if (aDue !== bDue) {
        return aDue - bDue;
      }

      return a.createdAt.getTime() - b.createdAt.getTime();
    });
}

export function getWeeklyTasks(tasks: TaskListItem[], today = new Date()): TaskListItem[] {
  return tasks.filter((task) => {
    if (task.isCompleted) {
      return false;
    }

    const rule = task.recurringRule;
    if (!rule) {
      return false;
    }

    return (
      appearsInWeek(rule) ||
      appearsInMonth(rule, today, task.dueDate) ||
      appearsInYear(rule, today, task.dueDate)
    );
  });
}

export function getPinnedNotesPreview(notes: NoteListItem[], limit = 3): NoteListItem[] {
  return notes.slice(0, limit);
}
