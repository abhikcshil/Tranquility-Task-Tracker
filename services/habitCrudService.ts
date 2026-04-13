import { prisma } from '@/lib/prisma';

export type HabitCreateInput = {
  title: string;
  notes?: string | null;
  categoryId?: number | null;
  frequencyType: 'daily' | 'weekly';
  targetCount?: number;
  pointValue?: number;
};

export async function createHabit(input: HabitCreateInput) {
  const title = input.title.trim();
  if (!title) {
    throw new Error('Habit title is required.');
  }

  const targetCount = input.targetCount ?? 1;
  if (!Number.isInteger(targetCount) || targetCount <= 0) {
    throw new Error('Habit target count must be positive.');
  }

  return prisma.habit.create({
    data: {
      title,
      notes: input.notes ?? null,
      categoryId: input.categoryId ?? null,
      frequencyType: input.frequencyType,
      targetCount,
      pointValue: input.pointValue ?? 5,
    },
  });
}
