import type { TaskListItem } from '@/services/taskService';

export function selectUpcomingReminders(
  tasks: TaskListItem[],
  now = new Date(),
  limit = 5,
): TaskListItem[] {
  return tasks
    .filter(
      (task) => !task.isArchived && !task.isCompleted && task.reminderAt && task.reminderAt >= now,
    )
    .sort((a, b) => a.reminderAt!.getTime() - b.reminderAt!.getTime())
    .slice(0, limit);
}
