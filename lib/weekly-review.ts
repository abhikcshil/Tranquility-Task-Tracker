import { getWeekRange } from '@/lib/dashboard';
import type { TaskListItem } from '@/services/taskService';

export type WeeklySummaryStats = {
  totalPoints: number;
  tasksCompleted: number;
  tasksMissed: number;
  habitsCompleted: number;
  weeklyGoal: number;
};

export function getPreviousWeekRange(today = new Date()) {
  const current = getWeekRange(today);
  const start = new Date(current.start);
  start.setDate(start.getDate() - 7);
  const end = new Date(current.end);
  end.setDate(end.getDate() - 7);
  return { start, end };
}

export function computeWeeklySummary(stats: WeeklySummaryStats) {
  return {
    ...stats,
    goalHit: stats.totalPoints >= stats.weeklyGoal,
  };
}

export function selectCarryoverTasks(tasks: TaskListItem[]): TaskListItem[] {
  return tasks.filter((task) => {
    if (task.isArchived) {
      return false;
    }

    if (task.recurringRule) {
      return true;
    }

    return !task.isCompleted;
  });
}
