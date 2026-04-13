import { parseQuickAddInput } from '@/lib/quick-add';
import { createHabit } from '@/services/habitCrudService';
import { createTask } from '@/services/taskService';

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
