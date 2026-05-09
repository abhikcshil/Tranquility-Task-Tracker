import type { RecurrenceInput, TaskInput } from '@/lib/validation';

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseOptionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parsePoints(value: FormDataEntryValue | null): number {
  const parsed = parseOptionalInt(value) ?? 5;
  return Math.max(0, Math.round(parsed / 5) * 5);
}

function combineDueDateAndTime(formData: FormData): string | null {
  const dueDate = parseOptionalString(formData.get('dueDate'));
  const dueTime = parseOptionalString(formData.get('dueTime'));

  if (!dueDate) {
    return null;
  }

  return dueTime ? `${dueDate}T${dueTime}` : dueDate;
}

function parseRecurrence(formData: FormData): RecurrenceInput | null {
  const type = String(formData.get('recurrenceType') ?? 'none') as RecurrenceInput['type'];
  if (type === 'none') {
    return null;
  }

  const recurrence: RecurrenceInput = {
    type,
    frequency: parseOptionalInt(formData.get('recurrenceFrequency')),
  };

  if (type === 'weekdays') {
    recurrence.weekdays = formData
      .getAll('weekdays')
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value));
  }

  return recurrence;
}

export function parseTaskFormData(formData: FormData): TaskInput {
  return {
    title: String(formData.get('title') ?? ''),
    notes: parseOptionalString(formData.get('notes')),
    categoryId: parseOptionalInt(formData.get('categoryId')),
    dueDate: combineDueDateAndTime(formData),
    reminderAt: parseOptionalString(formData.get('reminderAt')),
    pointValue: parsePoints(formData.get('pointValue')),
    recurrence: parseRecurrence(formData),
  };
}
