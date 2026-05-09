import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMonthCalendarDays,
  getTaskDatesForMonth,
  getTasksForCalendarDay,
} from '@/lib/calendar';
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

test('getMonthCalendarDays returns a six-week month grid', () => {
  const days = getMonthCalendarDays(
    new Date('2026-04-15T12:00:00.000Z'),
    new Date('2026-04-13T12:00:00.000Z'),
  );

  assert.equal(days.length, 42);
  assert.equal(days[0].date.getDay(), 0);
  assert.equal(days.some((day) => day.isToday), true);
  assert.equal(days.filter((day) => day.isCurrentMonth).length, 30);
});

test('getTasksForCalendarDay includes due tasks and supported recurring tasks', () => {
  const day = new Date('2026-04-13T12:00:00.000Z');
  const tasks = [
    makeTask({ id: 1, dueDate: new Date('2026-04-13T08:00:00.000Z') }),
    makeTask({ id: 2, dueDate: new Date('2026-04-14T08:00:00.000Z') }),
    makeTask({ id: 3, recurringRule: { type: 'daily', frequency: 1, daysOfWeek: null } }),
    makeTask({ id: 4, dueDate: new Date('2026-04-13T08:00:00.000Z'), isArchived: true }),
  ];

  assert.deepEqual(
    getTasksForCalendarDay(tasks, day).map((task) => task.id),
    [1, 3],
  );
});

test('getTaskDatesForMonth marks due and completed-created task dates', () => {
  const dates = getTaskDatesForMonth(
    [
      makeTask({ id: 1, dueDate: new Date('2026-04-13T08:00:00.000Z') }),
      makeTask({ id: 2, dueDate: new Date('2026-05-01T08:00:00.000Z') }),
      makeTask({
        id: 3,
        dueDate: null,
        isCompleted: true,
        createdAt: new Date('2026-04-20T08:00:00.000Z'),
      }),
    ],
    new Date('2026-04-01T12:00:00.000Z'),
  );

  assert.deepEqual(dates, ['2026-04-13', '2026-04-20']);
});
