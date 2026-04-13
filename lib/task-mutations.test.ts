import assert from 'node:assert/strict';
import test from 'node:test';

import { getTaskCompletionPlan } from '@/services/taskService';

test('getTaskCompletionPlan completes task and creates point event', () => {
  const plan = getTaskCompletionPlan(false);

  assert.equal(plan.nextCompleted, true);
  assert.equal(plan.pointEventAction, 'create');
});

test('getTaskCompletionPlan uncompletes task and removes point event', () => {
  const plan = getTaskCompletionPlan(true);

  assert.equal(plan.nextCompleted, false);
  assert.equal(plan.pointEventAction, 'delete');
});
