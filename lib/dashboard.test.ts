import assert from 'node:assert/strict';
import test from 'node:test';

import { computeDailyProgress, computeWeeklyPointsProgress, computeWeeklyTaskProgress, getTodayTasks, selectFocusTasks } from '@/lib/dashboard';
import type { TaskListItem } from '@/services/taskService';

function makeTask(overrides: Partial<TaskListItem>): TaskListItem {
  return {
    id: 1,
    title: 'Task',
    notes: null,
    dueDate: null,
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

test('computeDailyProgress counts due and recurring-today tasks', () => {
  const today = new Date('2026-04-13T09:00:00.000Z');
  const tasks = [
    makeTask({ id: 1, dueDate: new Date('2026-04-13T08:00:00.000Z'), isCompleted: true }),
    makeTask({ id: 2, recurringRule: { type: 'daily', frequency: 1, daysOfWeek: null }, isCompleted: false }),
    makeTask({ id: 3, recurringRule: { type: 'weekdays', frequency: 1, daysOfWeek: '1,3,5' }, isCompleted: true }),
  ];

  const result = computeDailyProgress(tasks, today);

  assert.equal(result.completed, 2);
  assert.equal(result.total, 3);
  assert.equal(result.percent, 67);
});

test('computeWeeklyTaskProgress uses weekly frequency targets', () => {
  const tasks = [
    makeTask({ id: 1, recurringRule: { type: 'weekly', frequency: 3, daysOfWeek: null }, weeklyProgress: { completed: 1, target: 3 } }),
    makeTask({ id: 2, recurringRule: { type: 'weekly', frequency: 2, daysOfWeek: null }, weeklyProgress: { completed: 2, target: 2 } }),
  ];

  const result = computeWeeklyTaskProgress(tasks);

  assert.equal(result.completed, 3);
  assert.equal(result.total, 5);
  assert.equal(result.percent, 60);
});

test('computeWeeklyPointsProgress clamps percent to 100', () => {
  const result = computeWeeklyPointsProgress(120, 100);

  assert.equal(result.completed, 120);
  assert.equal(result.total, 100);
  assert.equal(result.percent, 100);
});

test('getTodayTasks includes daily recurring tasks', () => {
  const today = new Date('2026-04-13T12:00:00.000Z');
  const tasks = [
    makeTask({ id: 1, recurringRule: { type: 'daily', frequency: 1, daysOfWeek: null } }),
    makeTask({ id: 2, recurringRule: { type: 'weekly', frequency: 1, daysOfWeek: null } }),
  ];

  assert.deepEqual(
    getTodayTasks(tasks, today).map((task) => task.id),
    [1],
  );
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
