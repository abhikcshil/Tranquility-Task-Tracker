import { selectUpcomingReminders } from '@/lib/reminders';
import { getTasks } from '@/services/taskService';

export async function getUpcomingReminders(limit = 5, now = new Date()) {
  const tasks = await getTasks(now);
  return selectUpcomingReminders(tasks, now, limit);
}
