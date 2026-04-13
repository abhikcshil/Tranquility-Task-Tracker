import assert from 'node:assert/strict';
import test from 'node:test';

import { computeMilestoneProgress } from '@/lib/settings';

test('computeMilestoneProgress orders milestones and marks reached state', () => {
  const result = computeMilestoneProgress(
    [
      { id: 1, label: 'Reward B', points: 250 },
      { id: 2, label: 'Reward A', points: 100 },
    ],
    180,
  );

  assert.deepEqual(
    result.map((item) => item.id),
    [2, 1],
  );
  assert.equal(result[0].reached, true);
  assert.equal(result[1].reached, false);
});
