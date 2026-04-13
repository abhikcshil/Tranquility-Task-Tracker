export type RecurrenceDescription = {
  label: string;
  details: string;
};

export type RecurringType = 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'yearly';

type RecurringLike = {
  type: string;
  frequency?: number | null;
  daysOfWeek?: string | null;
};

function normalizeFrequency(frequency?: number | null): number {
  return frequency && frequency > 0 ? frequency : 1;
}

export function parseDaysOfWeek(daysOfWeek: string | null | undefined): number[] {
  if (!daysOfWeek) {
    return [];
  }

  return daysOfWeek
    .split(',')
    .map((item) => Number.parseInt(item, 10))
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6);
}

export function describeRecurringRule(
  type: RecurringType,
  frequency?: number | null,
  daysOfWeek?: string | null,
): RecurrenceDescription {
  const normalizedFrequency = normalizeFrequency(frequency);

  switch (type) {
    case 'daily':
      return {
        label: 'Daily',
        details: normalizedFrequency === 1 ? 'Every day' : `Every ${normalizedFrequency} days`,
      };
    case 'weekdays': {
      const days = parseDaysOfWeek(daysOfWeek);
      if (days.length > 0) {
        return {
          label: 'Weekdays',
          details: `Days ${days.map((day) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}`,
        };
      }

      return {
        label: 'Weekdays',
        details: 'Monday through Friday',
      };
    }
    case 'weekly':
      return {
        label: 'Weekly',
        details: normalizedFrequency === 1 ? 'Every week' : `${normalizedFrequency}x per week`,
      };
    case 'monthly':
      return {
        label: 'Monthly',
        details: normalizedFrequency === 1 ? 'Every month' : `Every ${normalizedFrequency} months`,
      };
    case 'yearly':
      return {
        label: 'Yearly',
        details: normalizedFrequency === 1 ? 'Every year' : `Every ${normalizedFrequency} years`,
      };
    default:
      return {
        label: 'Recurring',
        details: 'Custom schedule',
      };
  }
}

export function appearsInToday(rule: RecurringLike | null, date: Date): boolean {
  if (!rule) {
    return false;
  }

  if (rule.type === 'daily') {
    return true;
  }

  if (rule.type === 'weekdays') {
    const configured = parseDaysOfWeek(rule.daysOfWeek);
    const activeDays = configured.length > 0 ? configured : [1, 2, 3, 4, 5];
    return activeDays.includes(date.getDay());
  }

  return false;
}

export function appearsInWeek(rule: RecurringLike | null): boolean {
  return rule?.type === 'weekly';
}

export function appearsInMonth(rule: RecurringLike | null, date: Date, dueDate: Date | null): boolean {
  if (rule?.type !== 'monthly' || !dueDate) {
    return false;
  }

  return dueDate.getDate() <= date.getDate();
}

export function appearsInYear(rule: RecurringLike | null, date: Date, dueDate: Date | null): boolean {
  if (rule?.type !== 'yearly' || !dueDate) {
    return false;
  }

  if (dueDate.getMonth() !== date.getMonth()) {
    return false;
  }

  return dueDate.getDate() <= date.getDate();
}
