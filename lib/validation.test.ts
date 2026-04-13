import assert from 'node:assert/strict';
import test from 'node:test';

import { validateTaskInput } from '@/lib/validation';

test('validateTaskInput enforces required title', () => {
  assert.throws(() => validateTaskInput({ title: '   ' }), /required/);
});

test('validateTaskInput rejects negative points', () => {
  assert.throws(() => validateTaskInput({ title: 'Read', pointValue: -1 }), /non-negative/);
});

test('validateTaskInput validates recurring frequency and weekdays', () => {
  assert.throws(
    () => validateTaskInput({ title: 'Run', recurrence: { type: 'weekly', frequency: 0 } }),
    /positive integer/,
  );

  assert.throws(
    () => validateTaskInput({ title: 'Run', recurrence: { type: 'weekdays', weekdays: [9] } }),
    /weekday/,
  );
});

test('validateTaskInput normalizes optional fields', () => {
  const result = validateTaskInput({
    title: '  Study chapter 3  ',
    notes: '  ',
    dueDate: '2026-04-20',
    recurrence: { type: 'weekdays', weekdays: [1, 3, 5], frequency: 1 },
  });

  assert.equal(result.title, 'Study chapter 3');
  assert.equal(result.notes, null);
  assert.equal(result.pointValue, 5);
  assert.equal(result.dueDate?.getFullYear(), 2026);
  assert.equal(result.dueDate?.getMonth(), 3);
  assert.equal(result.dueDate?.getDate(), 20);
  assert.equal(result.recurrence?.daysOfWeek, '1,3,5');
});


test('validateTaskInput preserves manual due date set to today local date', () => {
  const result = validateTaskInput({
    title: 'Manual task',
    dueDate: '2026-04-13',
  });

  assert.equal(result.dueDate?.getFullYear(), 2026);
  assert.equal(result.dueDate?.getMonth(), 3);
  assert.equal(result.dueDate?.getDate(), 13);
  assert.equal(result.dueDate?.getHours(), 0);
});
