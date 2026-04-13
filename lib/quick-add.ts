import { startOfLocalDay } from '@/lib/dates';
import type { RecurrenceInput } from '@/lib/validation';

export type QuickAddDestination = 'task' | 'habit';

export type ParsedQuickAdd = {
  title: string;
  dueDate: Date | null;
  reminderAt: Date | null;
  recurrence: RecurrenceInput | null;
  destination: QuickAddDestination;
  habitTargetCount: number;
};

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function nextWeekday(baseDate: Date, dayName: string): Date | null {
  const targetIndex = weekdays.indexOf(dayName.toLowerCase());
  if (targetIndex < 0) {
    return null;
  }

  const start = startOfLocalDay(baseDate);
  const offset = (targetIndex - start.getDay() + 7) % 7;
  const result = new Date(start);
  result.setDate(start.getDate() + offset);
  return result;
}

function cleanTitle(value: string): string {
  return value
    .replace(/\b\d+x\s+this week\b/i, '')
    .replace(/\bthis week\b/i, '')
    .replace(/\b(today|tonight|tomorrow)\b/i, '')
    .replace(/\bdaily\b/i, '')
    .replace(/\bmonthly\b/i, '')
    .replace(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i, '')
    .replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTimePhrase(raw: string, baseDate: Date): Date | null {
  const match = raw.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (!match) {
    return null;
  }

  const hour12 = Number.parseInt(match[1], 10);
  const minute = match[2] ? Number.parseInt(match[2], 10) : 0;
  const meridiem = match[3].toLowerCase();
  if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) {
    return null;
  }

  let hour24 = hour12 % 12;
  if (meridiem === 'pm') {
    hour24 += 12;
  }

  const reminderAt = new Date(baseDate);
  reminderAt.setHours(hour24, minute, 0, 0);
  return reminderAt;
}

function inferDestination(title: string, recurrence: RecurrenceInput | null): QuickAddDestination {
  const lowered = title.toLowerCase();
  const habitKeywords = ['vitamin', 'hydrate', 'water', 'meditate', 'journal', 'stretch'];

  if (recurrence?.type === 'daily' && habitKeywords.some((keyword) => lowered.includes(keyword))) {
    return 'habit';
  }

  if (lowered.startsWith('take ') && recurrence?.type === 'daily') {
    return 'habit';
  }

  return 'task';
}

export function parseQuickAddInput(rawInput: string, now = new Date()): ParsedQuickAdd {
  const raw = rawInput.trim().replace(/\s+/g, ' ');
  if (!raw) {
    throw new Error('Quick add text is required.');
  }

  let dueDate: Date | null = null;
  let reminderAt: Date | null = null;
  let recurrence: RecurrenceInput | null = null;
  let habitTargetCount = 1;

  const weeklyCountMatch = raw.match(/\b(\d+)x\s+this week\b/i);
  if (weeklyCountMatch) {
    const count = Number.parseInt(weeklyCountMatch[1], 10);
    if (Number.isInteger(count) && count > 0) {
      recurrence = { type: 'weekly', frequency: count };
      habitTargetCount = count;
    }
  } else if (/\bthis week\b/i.test(raw)) {
    recurrence = { type: 'weekly', frequency: 1 };
  }

  if (/\bdaily\b/i.test(raw)) {
    recurrence = { type: 'daily', frequency: 1 };
  }

  if (/\bmonthly\b/i.test(raw)) {
    recurrence = { type: 'monthly', frequency: 1 };
  }

  const hasTodayToken = /\btoday\b/i.test(raw);
  const hasTonightToken = /\btonight\b/i.test(raw);
  const hasNightToken = /\bnight\b/i.test(raw);

  if (/\b(today|tonight)\b/i.test(raw)) {
    dueDate = startOfLocalDay(now);
  } else if (/\btomorrow\b/i.test(raw)) {
    dueDate = startOfLocalDay(now);
    dueDate.setDate(dueDate.getDate() + 1);
  }

  const dayMatch = raw.match(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
  if (dayMatch) {
    const parsedDay = nextWeekday(now, dayMatch[1]);
    if (parsedDay) {
      dueDate = parsedDay;
    }
  }

  if ((hasTonightToken || hasNightToken) && dueDate) {
    reminderAt = new Date(dueDate);
    reminderAt.setHours(20, 0, 0, 0);
  }

  const explicitTime = parseTimePhrase(raw, dueDate ?? now);
  if (explicitTime) {
    reminderAt = explicitTime;
  }

  if (!dueDate && reminderAt && (hasTodayToken || hasTonightToken)) {
    dueDate = startOfLocalDay(now);
  }

  const title = cleanTitle(raw);
  if (!title) {
    throw new Error('Quick add title could not be parsed.');
  }

  const destination = inferDestination(title, recurrence);

  return {
    title,
    dueDate,
    reminderAt,
    recurrence,
    destination,
    habitTargetCount,
  };
}
