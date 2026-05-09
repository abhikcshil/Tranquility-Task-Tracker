import assert from 'node:assert/strict';
import test from 'node:test';

import { parseTaskFormData } from '@/lib/task-form';

test('parseTaskFormData keeps selected category id for task creation and editing', () => {
  const formData = new FormData();
  formData.set('title', 'Categorized task');
  formData.set('categoryId', '42');

  const parsed = parseTaskFormData(formData);

  assert.equal(parsed.categoryId, 42);
});

test('parseTaskFormData treats blank category as uncategorized', () => {
  const formData = new FormData();
  formData.set('title', 'Uncategorized task');
  formData.set('categoryId', '');

  const parsed = parseTaskFormData(formData);

  assert.equal(parsed.categoryId, null);
});
