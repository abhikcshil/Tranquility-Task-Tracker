import assert from 'node:assert/strict';
import test from 'node:test';

import { selectUpcomingReminders } from '@/lib/reminders';
import type { TaskListItem } from '@/services/taskService';

function makeTask(overrides: Partial<TaskListItem>): TaskListItem {
  return {
    id: 1,
    title: 'Task',
    notes: null,
    dueDate: null,
    reminderAt: null,
    categoryId: null,
    pointValue: 5,
    isCompleted: false,
    isArchived: false,
    createdAt: new Date('2026-04-01T10:00:00.000Z'),
    category: null,
    recurringRule: null,
    weeklyProgress: null,
    ...overrides,
  };
}

test('selectUpcomingReminders returns nearest pending reminders only', () => {
  const now = new Date('2026-04-13T09:00:00.000Z');
  const reminders = selectUpcomingReminders(
    [
      makeTask({ id: 1, reminderAt: new Date('2026-04-13T09:30:00.000Z') }),
      makeTask({ id: 2, reminderAt: new Date('2026-04-13T08:30:00.000Z') }),
      makeTask({ id: 3, reminderAt: new Date('2026-04-13T10:00:00.000Z'), isCompleted: true }),
      makeTask({ id: 4, reminderAt: new Date('2026-04-13T09:10:00.000Z') }),
    ],
    now,
  );

  assert.deepEqual(
    reminders.map((item) => item.id),
    [4, 1],
  );
});
