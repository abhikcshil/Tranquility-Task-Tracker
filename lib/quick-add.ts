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

function withLocalTime(date: Date, hours: number, minutes: number): Date {
  const result = startOfLocalDay(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

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

function parseTimeMatch(raw: string): { hours: number; minutes: number } | null {
  const timeMatch = raw.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (!timeMatch) {
    return null;
  }

  let hours = Number.parseInt(timeMatch[1], 10);
  const minutes = timeMatch[2] ? Number.parseInt(timeMatch[2], 10) : 0;
  const period = timeMatch[3].toLowerCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  if (period === 'pm' && hours !== 12) {
    hours += 12;
  }

  if (period === 'am' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

function cleanTitle(value: string): string {
  return value
    .replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i, '')
    .replace(/\b\d+x\s+this week\b/i, '')
    .replace(/\bthis week\b/i, '')
    .replace(/\btoday\b/i, '')
    .replace(/\btonight\b/i, '')
    .replace(/\btomorrow\b/i, '')
    .replace(/\bnight\b/i, '')
    .replace(/\bdaily\b/i, '')
    .replace(/\bmonthly\b/i, '')
    .replace(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i, '')
    .replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i, '')
    .replace(/\s+/g, ' ')
    .trim();
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
  const explicitTime = parseTimeMatch(raw);

  if (/\btoday\b/i.test(raw) || /\btonight\b/i.test(raw)) {
    dueDate = startOfLocalDay(now);
  }

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

  if (explicitTime && dueDate) {
    reminderAt = withLocalTime(dueDate, explicitTime.hours, explicitTime.minutes);
  } else if ((/\btonight\b/i.test(raw) || hasNightToken) && dueDate) {
    reminderAt = withLocalTime(dueDate, 20, 0);
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
