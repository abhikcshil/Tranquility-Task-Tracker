import type { RecurringType } from '@/lib/recurrence';

export type RecurrenceInput = {
  type: 'none' | RecurringType;
  frequency?: number | null;
  weekdays?: number[];
};

export type TaskInput = {
  title: string;
  notes?: string | null;
  categoryId?: number | null;
  dueDate?: string | Date | null;
  reminderAt?: string | Date | null;
  pointValue?: number | null;
  recurrence?: RecurrenceInput | null;
};

export type NoteInput = {
  title: string;
  content?: string;
};

function normalizeOptionalText(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

export function validateRecurrenceInput(input: RecurrenceInput | null | undefined) {
  if (!input || input.type === 'none') {
    return null;
  }

  const frequency = input.frequency ?? null;
  if (frequency !== null && (!Number.isInteger(frequency) || frequency <= 0)) {
    throw new Error('Recurring frequency must be a positive integer.');
  }

  const recurrence = {
    type: input.type,
    frequency,
    daysOfWeek: null as string | null,
  };

  if (input.type === 'weekdays') {
    const weekdays = input.weekdays ?? [];
    const unique = [...new Set(weekdays)].sort((a, b) => a - b);
    const allValid = unique.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);

    if (!allValid || unique.length === 0) {
      throw new Error('Weekday recurrence requires valid weekday values.');
    }

    recurrence.daysOfWeek = unique.join(',');
  }

  return recurrence;
}

export function validateReminderDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const reminderAt = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(reminderAt.getTime())) {
    throw new Error('Reminder date/time is invalid.');
  }

  return reminderAt;
}

export function validateTaskInput(input: TaskInput) {
  const title = input.title.trim();
  if (!title) {
    throw new Error('Task title is required.');
  }

  const categoryId = input.categoryId ?? null;
  if (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0)) {
    throw new Error('Category is invalid.');
  }

  const dueDateRaw = input.dueDate ?? null;
  let dueDate: Date | null = null;
  if (dueDateRaw) {
    dueDate = dueDateRaw instanceof Date ? dueDateRaw : new Date(dueDateRaw);
    if (Number.isNaN(dueDate.getTime())) {
      throw new Error('Due date is invalid.');
    }
  }

  const reminderAt = validateReminderDate(input.reminderAt);

  const pointValue = input.pointValue ?? 5;
  if (!Number.isFinite(pointValue) || pointValue < 0) {
    throw new Error('Point value must be non-negative.');
  }

  return {
    title,
    notes: normalizeOptionalText(input.notes),
    categoryId,
    dueDate,
    reminderAt,
    pointValue: Math.round(pointValue),
    recurrence: validateRecurrenceInput(input.recurrence),
  };
}

export function validateNoteInput(input: NoteInput) {
  const title = input.title.trim();
  if (!title) {
    throw new Error('Note title is required.');
  }

  return {
    title,
    content: (input.content ?? '').trim(),
  };
}

export function validateWeeklyGoal(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Weekly points goal must be a non-negative integer.');
  }

  return value;
}

export function validateMilestoneInput(input: { label: string; points: number }) {
  const label = input.label.trim();
  if (!label) {
    throw new Error('Milestone label is required.');
  }

  if (!Number.isInteger(input.points) || input.points <= 0) {
    throw new Error('Milestone points must be a positive integer.');
  }

  return {
    label,
    points: input.points,
  };
}
