import assert from 'node:assert/strict';
import test from 'node:test';

import {
  endOfLocalDay,
  endOfLocalWeek,
  isSameLocalDay,
  normalizeDateInput,
  parseLocalDateInput,
  startOfLocalDay,
  startOfLocalWeek,
} from '@/lib/dates';

test('normalizeDateInput treats date-only values as local calendar days', () => {
  const parsed = normalizeDateInput('2026-04-13');

  assert.equal(parsed.getFullYear(), 2026);
  assert.equal(parsed.getMonth(), 3);
  assert.equal(parsed.getDate(), 13);
  assert.equal(parsed.getHours(), 0);
});

test('isSameLocalDay compares by local date fields only', () => {
  const a = new Date('2026-04-13T00:01:00.000Z');
  const b = new Date('2026-04-13T23:59:00.000Z');

  assert.equal(isSameLocalDay(a, b), true);
});

test('local day and week boundaries are stable', () => {
  const now = new Date('2026-04-15T18:22:00.000Z'); // Wednesday

  const dayStart = startOfLocalDay(now);
  const dayEnd = endOfLocalDay(now);
  const weekStart = startOfLocalWeek(now);
  const weekEnd = endOfLocalWeek(now);

  assert.equal(dayStart.getHours(), 0);
  assert.equal(dayEnd.getHours(), 23);
  assert.equal(weekStart.getDay(), 1);
  assert.equal(weekEnd.getDay(), 0);
});

test('parseLocalDateInput rejects impossible calendar dates', () => {
  assert.equal(parseLocalDateInput('2026-02-31'), null);
});
