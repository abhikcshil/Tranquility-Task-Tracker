'use server';

import { revalidatePath } from 'next/cache';
import { quickAddCapture } from '@/services/quickAddService';
import {
  deleteRewardMilestone,
  saveRewardMilestone,
  setWeeklyPointsGoal,
} from '@/services/settingsService';
import { runWeeklyReset } from '@/services/weeklyReviewService';

export async function quickAddAction(formData: FormData) {
  const text = String(formData.get('quickAdd') ?? '');
  await quickAddCapture(text);

  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/habits');
}

export async function updateWeeklyGoalAction(formData: FormData) {
  const goal = Number(formData.get('weeklyGoal'));
  await setWeeklyPointsGoal(goal);

  revalidatePath('/');
  revalidatePath('/settings');
  revalidatePath('/weekly-review');
}

export async function addMilestoneAction(formData: FormData) {
  const label = String(formData.get('label') ?? '');
  const points = Number(formData.get('points'));

  await saveRewardMilestone(label, points);

  revalidatePath('/');
  revalidatePath('/settings');
}

export async function deleteMilestoneAction(formData: FormData) {
  const milestoneId = Number(formData.get('milestoneId'));
  if (!Number.isInteger(milestoneId) || milestoneId <= 0) {
    throw new Error('Milestone id is invalid.');
  }

  await deleteRewardMilestone(milestoneId);
  revalidatePath('/');
  revalidatePath('/settings');
}

export async function runWeeklyResetAction(formData: FormData) {
  const selected = formData
    .getAll('carryoverTaskId')
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  await runWeeklyReset(selected);

  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/weekly-review');
}
