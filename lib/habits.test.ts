import test from 'node:test';
import assert from 'node:assert/strict';

import { countHabitCompletionsWithinDays, getHabitCurrentStreak, getHabitProgressForDateRange } from '@/lib/habits';

test('countHabitCompletionsWithinDays counts only completions within window', () => {
  const now = new Date('2026-04-12T10:00:00.000Z');
  const dates = [
    new Date('2026-04-12T01:00:00.000Z'),
    new Date('2026-04-10T14:00:00.000Z'),
    new Date('2026-04-05T18:00:00.000Z'),
  ];

  const result = countHabitCompletionsWithinDays(dates, 7, now);

  assert.equal(result, 2);
});

test('getHabitProgressForDateRange returns completion and target state', () => {
  const progress = getHabitProgressForDateRange([new Date('2026-04-10'), new Date('2026-04-11')], 3);

  assert.equal(progress.completed, 2);
  assert.equal(progress.target, 3);
  assert.equal(progress.isComplete, false);
});

test('getHabitCurrentStreak calculates daily streak', () => {
  const now = new Date('2026-04-13T10:00:00.000Z');
  const streak = getHabitCurrentStreak('daily', [
    new Date('2026-04-13T08:00:00.000Z'),
    new Date('2026-04-12T08:00:00.000Z'),
    new Date('2026-04-11T08:00:00.000Z'),
  ], now);

  assert.equal(streak, 3);
});

test('getHabitCurrentStreak calculates weekly streak', () => {
  const now = new Date('2026-04-13T10:00:00.000Z');
  const streak = getHabitCurrentStreak('weekly', [
    new Date('2026-04-13T08:00:00.000Z'),
    new Date('2026-04-08T08:00:00.000Z'),
    new Date('2026-04-03T08:00:00.000Z'),
  ], now);

  assert.equal(streak, 3);
});
