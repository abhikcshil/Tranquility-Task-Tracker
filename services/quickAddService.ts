import { parseQuickAddInput } from '@/lib/quick-add';
import type { TaskInput } from '@/lib/validation';
import { createHabit } from '@/services/habitCrudService';
import { createTask } from '@/services/taskService';

export type QuickAddTaskInput = Omit<TaskInput, 'dueDate' | 'reminderAt'> & {
  dueDate: Date | null;
  reminderAt: Date | null;
};

export function buildQuickAddTaskInput(raw: string, now = new Date()): QuickAddTaskInput | null {
  const parsed = parseQuickAddInput(raw, now);

  if (parsed.destination !== 'task') {
    return null;
  }

  return {
    title: parsed.title,
    dueDate: parsed.dueDate,
    reminderAt: parsed.reminderAt,
    recurrence: parsed.recurrence,
    pointValue: 5,
    notes: null,
    categoryId: null,
  };
}

export async function quickAddCapture(raw: string) {
  const parsed = parseQuickAddInput(raw);

  if (parsed.destination === 'habit') {
    await createHabit({
      title: parsed.title,
      frequencyType: parsed.recurrence?.type === 'weekly' ? 'weekly' : 'daily',
      targetCount: parsed.habitTargetCount,
      pointValue: 5,
      notes: null,
      categoryId: null,
    });
    return;
  }

  await createTask({
    title: parsed.title,
    dueDate: parsed.dueDate,
    reminderAt: parsed.reminderAt,
    recurrence: parsed.recurrence,
    pointValue: 5,
    notes: null,
    categoryId: null,
  });
}
