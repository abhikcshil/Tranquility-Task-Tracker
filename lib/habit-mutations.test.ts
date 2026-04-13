import assert from 'node:assert/strict';
import test from 'node:test';

import { getHabitCompletionPlan } from '@/services/habitService';

test('getHabitCompletionPlan creates completion + points when incomplete today', () => {
  const plan = getHabitCompletionPlan(false);

  assert.equal(plan.shouldCreateCompletion, true);
  assert.equal(plan.shouldDeleteCompletion, false);
});

test('getHabitCompletionPlan removes completion + points when already complete today', () => {
  const plan = getHabitCompletionPlan(true);

  assert.equal(plan.shouldCreateCompletion, false);
  assert.equal(plan.shouldDeleteCompletion, true);
});
