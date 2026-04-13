'use server';

import { revalidatePath } from 'next/cache';
import { createHabitCompletion, removeHabitCompletion } from '@/services/habitService';

function getHabitId(formData: FormData): number {
  const habitId = Number(formData.get('habitId'));

  if (!Number.isInteger(habitId) || habitId <= 0) {
    throw new Error('Habit id is invalid.');
  }

  return habitId;
}

export async function completeHabitAction(formData: FormData) {
  await createHabitCompletion(getHabitId(formData));

  revalidatePath('/habits');
  revalidatePath('/');
}

export async function uncompleteHabitAction(formData: FormData) {
  await removeHabitCompletion(getHabitId(formData));

  revalidatePath('/habits');
  revalidatePath('/');
}
