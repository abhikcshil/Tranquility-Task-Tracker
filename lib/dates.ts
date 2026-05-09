const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
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

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
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

function isUtcMidnight(date: Date): boolean {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  );
}

export function isDueOnDay(dueDate: Date, day: Date): boolean {
  return isSameLocalDay(dueDate, day) || (isUtcMidnight(dueDate) && isSameUtcDay(dueDate, day));
}

export function formatDateInputValue(date: Date): string {
  if (isUtcMidnight(date)) {
    return [
      date.getUTCFullYear(),
      padDatePart(date.getUTCMonth() + 1),
      padDatePart(date.getUTCDate()),
    ].join('-');
  }

  return [date.getFullYear(), padDatePart(date.getMonth() + 1), padDatePart(date.getDate())].join(
    '-',
  );
}
