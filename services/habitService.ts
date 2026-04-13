import { prisma } from '@/lib/prisma';
import { getHabitCurrentStreak, getHabitProgressForDateRange, getEndOfWeek, getStartOfWeek, isSameLocalDay, type HabitFrequencyType } from '@/lib/habits';

export type HabitListItem = {
  id: number;
  title: string;
  notes: string | null;
  frequencyType: 'daily' | 'weekly';
  targetCount: number;
  pointValue: number;
  category: {
    name: string;
    color: string;
  } | null;
  completionCount: number;
  progress: {
    completed: number;
    target: number;
    isComplete: boolean;
  };
  streak: number;
  completedToday: boolean;
};


export type HabitCompletionPlan = {
  shouldCreateCompletion: boolean;
  shouldDeleteCompletion: boolean;
};

export function getHabitCompletionPlan(completedToday: boolean) : HabitCompletionPlan {
  return {
    shouldCreateCompletion: !completedToday,
    shouldDeleteCompletion: completedToday,
  };
}

export async function getHabits(today = new Date()): Promise<HabitListItem[]> {
  const weekStart = getStartOfWeek(today);
  const weekEnd = getEndOfWeek(today);

  const habits = await prisma.habit.findMany({
    include: {
      category: true,
      completions: {
        orderBy: { date: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return habits.map((habit) => {
    const periodCompletions =
      habit.frequencyType === 'daily'
        ? habit.completions.filter((completion) => isSameLocalDay(completion.date, today))
        : habit.completions.filter((completion) => completion.date >= weekStart && completion.date <= weekEnd);

    return {
      id: habit.id,
      title: habit.title,
      notes: habit.notes,
      frequencyType: habit.frequencyType as HabitFrequencyType,
      targetCount: habit.targetCount,
      pointValue: habit.pointValue,
      category: habit.category
        ? {
            name: habit.category.name,
            color: habit.category.color,
          }
        : null,
      completionCount: habit.completions.length,
      progress: getHabitProgressForDateRange(
        periodCompletions.map((completion) => completion.date),
        habit.targetCount,
      ),
      streak: getHabitCurrentStreak(
        habit.frequencyType as HabitFrequencyType,
        habit.completions.map((completion) => completion.date),
        today,
      ),
      completedToday: habit.completions.some((completion) => isSameLocalDay(completion.date, today)),
    };
  });
}

export async function createHabitCompletion(habitId: number, today = new Date()) {
  return prisma.$transaction(async (tx) => {
    const habit = await tx.habit.findUniqueOrThrow({ where: { id: habitId } });

    if (habit.pointValue < 0) {
      throw new Error('Habit point value must be non-negative.');
    }

    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const existingToday = await tx.habitCompletion.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    if (existingToday) {
      return;
    }

    if (habit.frequencyType === 'weekly') {
      const weekStart = getStartOfWeek(today);
      const weekEnd = getEndOfWeek(today);
      const weekCount = await tx.habitCompletion.count({
        where: {
          habitId,
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      });

      if (weekCount >= habit.targetCount) {
        return;
      }
    }

    const completion = await tx.habitCompletion.create({
      data: {
        habitId,
        date,
      },
    });

    await tx.pointEvent.create({
      data: {
        amount: habit.pointValue,
        sourceType: 'habit',
        sourceId: completion.id,
      },
    });
  });
}

export async function removeHabitCompletion(habitId: number, today = new Date()) {
  return prisma.$transaction(async (tx) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const completion = await tx.habitCompletion.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    if (!completion) {
      return;
    }

    await tx.pointEvent.deleteMany({
      where: {
        sourceType: 'habit',
        sourceId: completion.id,
      },
    });

    await tx.habitCompletion.delete({ where: { id: completion.id } });
  });
}

export async function getHabitProgress(habitId: number, today = new Date()) {
  const habits = await getHabits(today);
  const habit = habits.find((item) => item.id === habitId);

  if (!habit) {
    throw new Error('Habit not found.');
  }

  return habit.progress;
}

export async function getHabitStreak(habitId: number, today = new Date()) {
  const habits = await getHabits(today);
  const habit = habits.find((item) => item.id === habitId);

  if (!habit) {
    throw new Error('Habit not found.');
  }

  return habit.streak;
}
