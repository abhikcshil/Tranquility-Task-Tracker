import assert from 'node:assert/strict';
import test from 'node:test';

import { validateTaskInput } from '@/lib/validation';

test('validateTaskInput enforces required title', () => {
  assert.throws(() => validateTaskInput({ title: '   ' }), /required/);
});

test('validateTaskInput rejects negative points', () => {
  assert.throws(() => validateTaskInput({ title: 'Read', pointValue: -1 }), /non-negative/);
});

test('validateTaskInput normalizes optional fields', () => {
  const result = validateTaskInput({
    title: '  Study chapter 3  ',
    notes: '  ',
    dueDate: '2026-04-20',
  });

  assert.equal(result.title, 'Study chapter 3');
  assert.equal(result.notes, null);
  assert.equal(result.pointValue, 5);
  assert.equal(result.dueDate?.toISOString().startsWith('2026-04-20'), true);
});
