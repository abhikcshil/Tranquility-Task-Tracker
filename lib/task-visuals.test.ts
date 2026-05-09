import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getTaskCategoryCueColor,
  getTaskCompletionCueColor,
  getTaskVisualStatus,
} from '@/lib/task-visuals';

test('task visual status maps incomplete tasks to yellow cue', () => {
  const task = { isCompleted: false, category: { color: '#38bdf8' } };

  assert.equal(getTaskVisualStatus(task), 'incomplete');
  assert.equal(getTaskCompletionCueColor(task), '#facc15');
  assert.equal(getTaskCategoryCueColor(task), '#38bdf8');
});

test('task visual status maps completed tasks to green cue', () => {
  const task = { isCompleted: true, category: null };

  assert.equal(getTaskVisualStatus(task), 'complete');
  assert.equal(getTaskCompletionCueColor(task), '#34d399');
  assert.equal(getTaskCategoryCueColor(task), '#52525b');
});

test('task visual status treats completed weekly targets as green', () => {
  const task = {
    isCompleted: false,
    weeklyProgress: { completed: 3, target: 3 },
    category: { color: '#f472b6' },
  };

  assert.equal(getTaskVisualStatus(task), 'complete');
  assert.equal(getTaskCompletionCueColor(task), '#34d399');
  assert.equal(getTaskCategoryCueColor(task), '#f472b6');
});

test('task visual status keeps unfinished weekly targets yellow', () => {
  const task = {
    isCompleted: false,
    weeklyProgress: { completed: 2, target: 3 },
    category: null,
  };

  assert.equal(getTaskVisualStatus(task), 'incomplete');
  assert.equal(getTaskCompletionCueColor(task), '#facc15');
});
