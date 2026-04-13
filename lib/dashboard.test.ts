import assert from 'node:assert/strict';
import test from 'node:test';

import {
  computeDailyProgress,
  computeWeeklyPointsProgress,
  computeWeeklyTaskProgress,
  selectFocusTasks,
} from '@/lib/dashboard';
import type { TaskListItem } from '@/services/taskService';

function makeTask(overrides: Partial<TaskListItem>): TaskListItem {
  return {
    id: 1,
    title: 'Task',
    notes: null,
    dueDate: null,
    isCompleted: false,
    isArchived: false,
    createdAt: new Date('2026-04-01T10:00:00.000Z'),
    category: null,
    recurringRule: null,
    ...overrides,
  };
}

test('computeDailyProgress counts only one-time tasks due today', () => {
  const today = new Date('2026-04-13T09:00:00.000Z');
  const tasks = [
    makeTask({ id: 1, dueDate: new Date('2026-04-13T08:00:00.000Z'), isCompleted: true }),
    makeTask({ id: 2, dueDate: new Date('2026-04-13T08:00:00.000Z'), isCompleted: false }),
    makeTask({ id: 3, dueDate: new Date('2026-04-14T08:00:00.000Z'), isCompleted: true }),
    makeTask({
      id: 4,
      dueDate: new Date('2026-04-13T08:00:00.000Z'),
      recurringRule: { type: 'weekly', frequency: 1 },
      isCompleted: true,
    }),
  ];

  const result = computeDailyProgress(tasks, today);

  assert.equal(result.completed, 1);
  assert.equal(result.total, 2);
  assert.equal(result.percent, 50);
});

test('computeWeeklyTaskProgress returns completed weekly recurring tasks', () => {
  const tasks = [
    makeTask({ id: 1, recurringRule: { type: 'weekly', frequency: 1 }, isCompleted: true }),
    makeTask({ id: 2, recurringRule: { type: 'weekly', frequency: 1 }, isCompleted: false }),
    makeTask({ id: 3, recurringRule: { type: 'daily', frequency: 1 }, isCompleted: true }),
  ];

  const result = computeWeeklyTaskProgress(tasks);

  assert.equal(result.completed, 1);
  assert.equal(result.total, 2);
  assert.equal(result.percent, 50);
});

test('computeWeeklyPointsProgress clamps percent to 100', () => {
  const result = computeWeeklyPointsProgress(120, 100);

  assert.equal(result.completed, 120);
  assert.equal(result.total, 100);
  assert.equal(result.percent, 100);
});

test('selectFocusTasks prioritizes overdue, then today, then oldest incomplete', () => {
  const today = new Date('2026-04-13T12:00:00.000Z');
  const tasks = [
    makeTask({ id: 1, title: 'No due old', createdAt: new Date('2026-03-20T09:00:00.000Z') }),
    makeTask({ id: 2, title: 'Due today', dueDate: new Date('2026-04-13T14:00:00.000Z') }),
    makeTask({ id: 3, title: 'Overdue', dueDate: new Date('2026-04-10T10:00:00.000Z') }),
    makeTask({ id: 4, title: 'Future', dueDate: new Date('2026-04-15T10:00:00.000Z') }),
    makeTask({ id: 5, title: 'Completed overdue', dueDate: new Date('2026-04-10T10:00:00.000Z'), isCompleted: true }),
  ];

  const result = selectFocusTasks(tasks, today, 3);

  assert.deepEqual(
    result.map((task) => task.id),
    [3, 2, 4],
  );
});
