'use server';

import { revalidatePath } from 'next/cache';
import { archiveTask, createTask, toggleTaskCompletion, updateTask } from '@/services/taskService';
import { parseTaskFormData } from '@/lib/task-form';

export type TaskActionState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

export async function createTaskAction(formData: FormData) {
  await createTask(parseTaskFormData(formData));

  revalidatePath('/tasks');
  revalidatePath('/');
  revalidatePath('/focus');
}

export async function updateTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'));

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new Error('Task id is invalid.');
  }

  await updateTask(taskId, parseTaskFormData(formData));

  revalidatePath('/tasks');
  revalidatePath('/');
  revalidatePath('/focus');
}

export async function updateTaskWithStateAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  try {
    await updateTaskAction(formData);
    return { status: 'success', message: 'Task saved.' };
  } catch (error) {
    return { status: 'error', message: getErrorMessage(error) };
  }
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
