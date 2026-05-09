import { prisma } from '@/lib/prisma';

export type HabitInput = {
  title: string;
  notes?: string | null;
  categoryId?: number | null;
  frequencyType: 'daily' | 'weekly';
  targetCount?: number;
  pointValue?: number;
};

function validateHabitInput(input: HabitInput) {
  const title = input.title.trim();
  if (!title) {
    throw new Error('Habit title is required.');
  }

  const categoryId = input.categoryId ?? null;
  if (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0)) {
    throw new Error('Habit category is invalid.');
  }

  if (input.frequencyType !== 'daily' && input.frequencyType !== 'weekly') {
    throw new Error('Habit frequency is invalid.');
  }

  const targetCount = input.targetCount ?? 1;
  if (!Number.isInteger(targetCount) || targetCount <= 0) {
    throw new Error('Habit target count must be positive.');
  }

  const pointValue = input.pointValue ?? 5;
  if (!Number.isFinite(pointValue) || pointValue < 0) {
    throw new Error('Habit point value must be non-negative.');
  }

  return {
    title,
    notes: input.notes?.trim() ? input.notes.trim() : null,
    categoryId,
    frequencyType: input.frequencyType,
    targetCount,
    pointValue: Math.round(pointValue),
  };
}

export async function createHabit(input: HabitInput) {
  const valid = validateHabitInput(input);

  return prisma.habit.create({
    data: {
      title: valid.title,
      notes: valid.notes,
      categoryId: valid.categoryId,
      frequencyType: valid.frequencyType,
      targetCount: valid.targetCount,
      pointValue: valid.pointValue,
    },
  });
}

export async function updateHabit(habitId: number, input: HabitInput) {
  const valid = validateHabitInput(input);

  return prisma.habit.update({
    where: { id: habitId },
    data: {
      title: valid.title,
      notes: valid.notes,
      categoryId: valid.categoryId,
      frequencyType: valid.frequencyType,
      targetCount: valid.targetCount,
      pointValue: valid.pointValue,
    },
  });
}

export async function deleteHabit(habitId: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const completions = await tx.habitCompletion.findMany({
      where: { habitId },
      select: { id: true },
    });

    await tx.pointEvent.deleteMany({
      where: {
        sourceType: 'habit',
        sourceId: { in: completions.map((completion) => completion.id) },
      },
    });

    await tx.habit.delete({ where: { id: habitId } });
  });
}

export const validateHabitForTests = validateHabitInput;
