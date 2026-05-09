import assert from 'node:assert/strict';
import test from 'node:test';

import { parseHabitFormData } from '@/lib/habit-form';
import { validateHabitForTests } from '@/services/habitCrudService';

test('parseHabitFormData parses habit create and edit fields', () => {
  const formData = new FormData();
  formData.set('title', '  Stretch  ');
  formData.set('notes', '  Ten minutes  ');
  formData.set('categoryId', '7');
  formData.set('frequencyType', 'weekly');
  formData.set('targetCount', '3');
  formData.set('pointValue', '12');

  const parsed = parseHabitFormData(formData);
  const valid = validateHabitForTests(parsed);

  assert.equal(valid.title, 'Stretch');
  assert.equal(valid.notes, 'Ten minutes');
  assert.equal(valid.categoryId, 7);
  assert.equal(valid.frequencyType, 'weekly');
  assert.equal(valid.targetCount, 3);
  assert.equal(valid.pointValue, 10);
});

test('validateHabitInput rejects invalid habit values', () => {
  assert.throws(
    () => validateHabitForTests({ title: '', frequencyType: 'daily', targetCount: 1 }),
    /title/,
  );
  assert.throws(
    () => validateHabitForTests({ title: 'Run', frequencyType: 'daily', targetCount: 0 }),
    /target/,
  );
  assert.throws(
    () => validateHabitForTests({ title: 'Run', frequencyType: 'daily', pointValue: -5 }),
    /point/,
  );
});
