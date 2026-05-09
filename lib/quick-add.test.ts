import assert from 'node:assert/strict';
import test from 'node:test';

import { parseQuickAddInput } from '@/lib/quick-add';

const now = new Date('2026-04-13T10:00:00.000Z'); // Monday

test('parseQuickAddInput handles tomorrow and title cleanup', () => {
  const parsed = parseQuickAddInput('Call mom tomorrow', now);

  assert.equal(parsed.title, 'Call mom');
  assert.equal(parsed.recurrence, null);
  assert.equal(parsed.destination, 'task');
  assert.equal(parsed.dueDate?.toISOString().startsWith('2026-04-14'), true);
  assert.equal(parsed.reminderAt, null);
});

test('parseQuickAddInput handles today and title cleanup', () => {
  const parsed = parseQuickAddInput('pack bags today', now);

  assert.equal(parsed.title, 'pack bags');
  assert.equal(parsed.destination, 'task');
  assert.equal(parsed.dueDate?.getFullYear(), now.getFullYear());
  assert.equal(parsed.dueDate?.getMonth(), now.getMonth());
  assert.equal(parsed.dueDate?.getDate(), now.getDate());
  assert.equal(parsed.reminderAt, null);
});

test('parseQuickAddInput handles tonight with default reminder', () => {
  const parsed = parseQuickAddInput('eat brocolli tonight', now);

  assert.equal(parsed.title, 'eat brocolli');
  assert.equal(parsed.dueDate?.getFullYear(), now.getFullYear());
  assert.equal(parsed.dueDate?.getMonth(), now.getMonth());
  assert.equal(parsed.dueDate?.getDate(), now.getDate());
  assert.equal(parsed.reminderAt?.getHours(), 20);
  assert.equal(parsed.reminderAt?.getMinutes(), 0);
});

test('parseQuickAddInput handles explicit tonight time', () => {
  const parsed = parseQuickAddInput('test tonight at 10:30pm', now);

  assert.equal(parsed.title, 'test');
  assert.equal(parsed.dueDate?.getFullYear(), now.getFullYear());
  assert.equal(parsed.dueDate?.getMonth(), now.getMonth());
  assert.equal(parsed.dueDate?.getDate(), now.getDate());
  assert.equal(parsed.reminderAt?.getHours(), 22);
  assert.equal(parsed.reminderAt?.getMinutes(), 30);
});

test('parseQuickAddInput handles weekly frequency shorthand', () => {
  const parsed = parseQuickAddInput('Gym 3x this week', now);

  assert.equal(parsed.title, 'Gym');
  assert.equal(parsed.recurrence?.type, 'weekly');
  assert.equal(parsed.recurrence?.frequency, 3);
});

test('parseQuickAddInput routes daily vitamin task to habit', () => {
  const parsed = parseQuickAddInput('Take vitamins daily', now);

  assert.equal(parsed.title, 'Take vitamins');
  assert.equal(parsed.recurrence?.type, 'daily');
  assert.equal(parsed.destination, 'habit');
});
