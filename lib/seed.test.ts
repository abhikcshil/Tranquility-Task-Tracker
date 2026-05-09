import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('seed script does not create starter point events', () => {
  const seedSource = readFileSync('prisma/seed.ts', 'utf8');

  assert.equal(seedSource.includes('pointEvent.create'), false);
});
