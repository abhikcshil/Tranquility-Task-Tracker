import test from 'node:test';
import assert from 'node:assert/strict';

import { countHabitCompletionsWithinDays } from '@/lib/habits';

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
