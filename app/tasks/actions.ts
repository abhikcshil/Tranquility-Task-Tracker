'use server';

import { revalidatePath } from 'next/cache';
import { archiveTask, createTask, toggleTaskCompletion, updateTask } from '@/services/taskService';
import type { RecurrenceInput } from '@/lib/validation';

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

export async function createTaskAction(formData: FormData) {
  await createTask({
    title: String(formData.get('title') ?? ''),
    notes: parseOptionalString(formData.get('notes')),
    categoryId: parseOptionalInt(formData.get('categoryId')),
    dueDate: parseOptionalString(formData.get('dueDate')),
    reminderAt: parseOptionalString(formData.get('reminderAt')),
    pointValue: parseOptionalInt(formData.get('pointValue')),
    recurrence: parseRecurrence(formData),
  });

  revalidatePath('/tasks');
  revalidatePath('/');
  revalidatePath('/focus');
}

export async function updateTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'));

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new Error('Task id is invalid.');
  }

  await updateTask(taskId, {
    title: String(formData.get('title') ?? ''),
    notes: parseOptionalString(formData.get('notes')),
    categoryId: parseOptionalInt(formData.get('categoryId')),
    dueDate: parseOptionalString(formData.get('dueDate')),
    reminderAt: parseOptionalString(formData.get('reminderAt')),
    pointValue: parseOptionalInt(formData.get('pointValue')),
    recurrence: parseRecurrence(formData),
  });

  revalidatePath('/tasks');
  revalidatePath('/');
  revalidatePath('/focus');
}

export async function toggleTaskCompletionAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'));

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new Error('Task id is invalid.');
  }

  await toggleTaskCompletion(taskId);

  revalidatePath('/tasks');
  revalidatePath('/');
  revalidatePath('/focus');
}

export async function archiveTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'));

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new Error('Task id is invalid.');
  }

  await archiveTask(taskId);

  revalidatePath('/tasks');
  revalidatePath('/');
  revalidatePath('/focus');
}
