import assert from 'node:assert/strict';
import test from 'node:test';

import { parseQuickAddInput } from '@/lib/quick-add';

const now = new Date('2026-04-13T10:00:00.000Z'); // Monday

test('parseQuickAddInput handles tonight as due today', () => {
  const parsed = parseQuickAddInput('take a multivitamin tonight', now);

  assert.equal(parsed.title, 'take a multivitamin');
  assert.equal(parsed.destination, 'task');
  assert.equal(parsed.recurrence, null);
  assert.equal(parsed.dueDate?.getFullYear(), 2026);
  assert.equal(parsed.dueDate?.getMonth(), 3);
  assert.equal(parsed.dueDate?.getDate(), 13);
});

test('parseQuickAddInput handles tomorrow and title cleanup', () => {
  const parsed = parseQuickAddInput('Call mom tomorrow', now);

  assert.equal(parsed.title, 'Call mom');
  assert.equal(parsed.recurrence, null);
  assert.equal(parsed.destination, 'task');
  assert.equal(parsed.dueDate?.getDate(), 14);
});

test('parseQuickAddInput handles this week recurrence', () => {
  const parsed = parseQuickAddInput('Laundry this week', now);

  assert.equal(parsed.title, 'Laundry');
  assert.equal(parsed.recurrence?.type, 'weekly');
  assert.equal(parsed.recurrence?.frequency, 1);
});

test('parseQuickAddInput handles weekly frequency shorthand', () => {
  const parsed = parseQuickAddInput('Gym 3x this week', now);

  assert.equal(parsed.title, 'Gym');
  assert.equal(parsed.recurrence?.type, 'weekly');
  assert.equal(parsed.recurrence?.frequency, 3);
});

test('parseQuickAddInput supports weekday names', () => {
  const parsed = parseQuickAddInput('Clean kitchen Friday', now);

  assert.equal(parsed.title, 'Clean kitchen');
  assert.equal(parsed.dueDate?.getDay(), 5);
});

test('parseQuickAddInput routes daily vitamin task to habit', () => {
  const parsed = parseQuickAddInput('Take vitamins daily', now);

  assert.equal(parsed.title, 'Take vitamins');
  assert.equal(parsed.recurrence?.type, 'daily');
  assert.equal(parsed.destination, 'habit');
});
