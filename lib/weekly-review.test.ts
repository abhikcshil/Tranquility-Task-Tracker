import assert from 'node:assert/strict';
import test from 'node:test';

import { computeWeeklySummary, selectCarryoverTasks } from '@/lib/weekly-review';
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

test('computeWeeklySummary marks goal hit correctly', () => {
  const summary = computeWeeklySummary({
    totalPoints: 120,
    tasksCompleted: 6,
    tasksMissed: 2,
    habitsCompleted: 8,
    weeklyGoal: 100,
  });

  assert.equal(summary.goalHit, true);
});

test('selectCarryoverTasks keeps incomplete one-time and recurring tasks', () => {
  const results = selectCarryoverTasks([
    makeTask({ id: 1, isCompleted: false }),
    makeTask({ id: 2, isCompleted: true }),
    makeTask({
      id: 3,
      isCompleted: true,
      recurringRule: { type: 'weekly', frequency: 1, daysOfWeek: null },
    }),
    makeTask({ id: 4, isArchived: true }),
  ]);

  assert.deepEqual(
    results.map((task) => task.id),
    [1, 3],
  );
});
