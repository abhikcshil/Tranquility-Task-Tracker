import assert from 'node:assert/strict';
import test from 'node:test';

import { getToggledPinnedValue } from '@/services/noteService';

test('getToggledPinnedValue flips pin state', () => {
  assert.equal(getToggledPinnedValue(true), false);
  assert.equal(getToggledPinnedValue(false), true);
});
