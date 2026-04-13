import test from 'node:test';
import assert from 'node:assert/strict';

import { describeRecurringRule } from '@/lib/recurrence';

test('describeRecurringRule returns expected weekly description', () => {
  const description = describeRecurringRule('weekly', 2);

  assert.equal(description.label, 'Weekly');
  assert.equal(description.details, 'Every 2 weeks');
});
