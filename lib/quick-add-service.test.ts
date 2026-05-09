import assert from 'node:assert/strict';
import test from 'node:test';

import { getActiveTodayTasks } from '@/lib/dashboard';
import { selectUpcomingReminders } from '@/lib/reminders';
import { validateTaskInput } from '@/lib/validation';
import { buildQuickAddTaskInput } from '@/services/quickAddService';
import type { TaskListItem } from '@/services/taskService';

const now = new Date('2026-04-13T10:00:00.000Z');

function makeTaskFromQuickAdd(id: number, raw: string): TaskListItem {
  const input = buildQuickAddTaskInput(raw, now);
  if (!input) {
    throw new Error('Expected quick add input to create a task.');
  }

  return {
    id,
    title: input.title,
    notes: input.notes ?? null,
    dueDate: input.dueDate ?? null,
    reminderAt: input.reminderAt ?? null,
    categoryId: input.categoryId ?? null,
    pointValue: input.pointValue ?? 5,
    isCompleted: false,
    isArchived: false,
    createdAt: now,
    category: null,
    recurringRule: null,
    weeklyProgress: null,
  };
}

test('buildQuickAddTaskInput keeps due date for today phrases before persistence', () => {
  const input = buildQuickAddTaskInput('pack bags today', now);

  assert.equal(input?.title, 'pack bags');
  assert.equal(input?.dueDate?.getFullYear(), now.getFullYear());
  assert.equal(input?.dueDate?.getMonth(), now.getMonth());
  assert.equal(input?.dueDate?.getDate(), now.getDate());
  assert.equal(input?.reminderAt, null);
});

test('quick add task input keeps due date through task validation', () => {
  const input = buildQuickAddTaskInput('pack bags today', now);
  if (!input) {
    throw new Error('Expected quick add input to create a task.');
  }

  const valid = validateTaskInput(input);

  assert.equal(valid.title, 'pack bags');
  assert.equal(valid.dueDate?.getFullYear(), now.getFullYear());
  assert.equal(valid.dueDate?.getMonth(), now.getMonth());
  assert.equal(valid.dueDate?.getDate(), now.getDate());
});

test('quick add task shape appears in active today and upcoming reminders', () => {
  const task = makeTaskFromQuickAdd(1, 'eat brocolli tonight');

  assert.deepEqual(
    getActiveTodayTasks([task], now).map((item) => item.id),
    [1],
  );
  assert.deepEqual(
    selectUpcomingReminders([task], now).map((item) => item.id),
    [1],
  );
});

test('quick add tomorrow task is not selected for active today', () => {
  const task = makeTaskFromQuickAdd(1, 'call mom tomorrow');

  assert.deepEqual(getActiveTodayTasks([task], now), []);
  assert.equal(task.dueDate?.getDate(), now.getDate() + 1);
});
