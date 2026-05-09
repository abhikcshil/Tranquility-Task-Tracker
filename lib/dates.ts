const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const APP_DISPLAY_TIME_ZONE = 'America/New_York';

const DISPLAY_LOCALE = 'en-US';

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function isUtcMidnight(date: Date): boolean {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  );
}

function displayDateForFormatting(date: Date): Date {
  if (!isUtcMidnight(date)) {
    return date;
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
}

function formatInAppTimeZone(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    timeZone: APP_DISPLAY_TIME_ZONE,
    ...options,
  }).format(displayDateForFormatting(date));
}

function getDisplayDatePart(date: Date, type: 'year' | 'month' | 'day'): string {
  const part = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    timeZone: APP_DISPLAY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(displayDateForFormatting(date))
    .find((item) => item.type === type)?.value;

  if (!part) {
    throw new Error(`Unable to format ${type} for date.`);
  }

  return part;
}

export function parseLocalDateInput(value: string): Date | null {
  const match = value.match(DATE_ONLY_PATTERN);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

export const parseDateOnlyAsLocalDay = parseLocalDateInput;

export function parseDateInput(value: string | Date, fieldName: string): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`${fieldName} is invalid.`);
    }

    return value;
  }

  const dateOnly = parseLocalDateInput(value);
  const parsed = dateOnly ?? new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} is invalid.`);
  }

  return parsed;
}

export function normalizeDateInput(value: string | Date): Date {
  return parseDateInput(value, 'Date');
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfLocalDay(date: Date): Date {
  const end = startOfLocalDay(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function startOfLocalWeek(date: Date): Date {
  const start = startOfLocalDay(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

export function endOfLocalWeek(date: Date): Date {
  const end = startOfLocalWeek(date);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function isSameLocalDay(dateA: Date, dateB: Date): boolean {
  return (
    (dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()) ||
    isSameUtcDay(dateA, dateB)
  );
}

function isSameUtcDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
    dateA.getUTCMonth() === dateB.getUTCMonth() &&
    dateA.getUTCDate() === dateB.getUTCDate()
  );
}

export function isDueOnDay(dueDate: Date, day: Date): boolean {
  return isSameLocalDay(dueDate, day) || (isUtcMidnight(dueDate) && isSameUtcDay(dueDate, day));
}

export function formatDateKey(date: Date): string {
  if (isUtcMidnight(date)) {
    return [
      date.getUTCFullYear(),
      padDatePart(date.getUTCMonth() + 1),
      padDatePart(date.getUTCDate()),
    ].join('-');
  }

  return [
    getDisplayDatePart(date, 'year'),
    getDisplayDatePart(date, 'month'),
    getDisplayDatePart(date, 'day'),
  ].join('-');
}

export function formatDateInputValue(date: Date): string {
  return formatDateKey(date);
}

export function formatDisplayDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
): string {
  return formatInAppTimeZone(date, options);
}

export function formatDisplayDateTime(date: Date): string {
  return formatInAppTimeZone(date, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatCalendarMonthLabel(date: Date): string {
  return formatDisplayDate(date, { month: 'long', year: 'numeric' });
}

export function formatCalendarDayLabel(date: Date): string {
  return formatDisplayDate(date, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatCalendarSelectLabel(date: Date): string {
  return formatDisplayDate(date, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTaskDueLabel(date: Date): string {
  return `Due ${formatDisplayDate(date, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}
