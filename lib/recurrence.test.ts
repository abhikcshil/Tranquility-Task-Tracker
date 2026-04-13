import test from 'node:test';
import assert from 'node:assert/strict';

import { appearsInMonth, appearsInToday, appearsInWeek, appearsInYear, describeRecurringRule } from '@/lib/recurrence';

test('describeRecurringRule returns expected weekly description', () => {
  const description = describeRecurringRule('weekly', 2);

  assert.equal(description.label, 'Weekly');
  assert.equal(description.details, '2x per week');
});

test('appearsInToday checks weekdays configuration', () => {
  const monday = new Date('2026-04-13T12:00:00.000Z');
  assert.equal(appearsInToday({ type: 'weekdays', daysOfWeek: '1,3,5' }, monday), true);
  assert.equal(appearsInToday({ type: 'weekdays', daysOfWeek: '2,4' }, monday), false);
});

test('appearsInWeek only returns true for weekly type', () => {
  assert.equal(appearsInWeek({ type: 'weekly' }), true);
  assert.equal(appearsInWeek({ type: 'daily' }), false);
});

test('appearsInMonth and appearsInYear use due date windows', () => {
  const now = new Date('2026-04-13T12:00:00.000Z');
  assert.equal(appearsInMonth({ type: 'monthly' }, now, new Date('2026-04-10T12:00:00.000Z')), true);
  assert.equal(appearsInYear({ type: 'yearly' }, now, new Date('2020-04-12T12:00:00.000Z')), true);
});
