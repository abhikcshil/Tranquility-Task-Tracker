import { prisma } from '@/lib/prisma';

export type HabitListItem = {
  id: number;
  title: string;
  notes: string | null;
  frequencyType: 'daily' | 'weekly';
  targetCount: number;
  category: {
    name: string;
    color: string;
  } | null;
  completionCount: number;
};

export async function getHabits(): Promise<HabitListItem[]> {
  const habits = await prisma.habit.findMany({
    include: {
      category: true,
      completions: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return habits.map((habit) => ({
    id: habit.id,
    title: habit.title,
    notes: habit.notes,
    frequencyType: habit.frequencyType,
    targetCount: habit.targetCount,
    category: habit.category
      ? {
          name: habit.category.name,
          color: habit.category.color,
        }
      : null,
    completionCount: habit.completions.length,
  }));
}
