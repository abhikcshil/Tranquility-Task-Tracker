import { prisma } from '@/lib/prisma';

export type TaskListItem = {
  id: number;
  title: string;
  notes: string | null;
  dueDate: Date | null;
  isCompleted: boolean;
  isArchived: boolean;
  category: {
    name: string;
    color: string;
  } | null;
  recurringRule: {
    type: string;
    frequency: number | null;
  } | null;
};

export async function getTasks(): Promise<TaskListItem[]> {
  const tasks = await prisma.task.findMany({
    where: { isArchived: false },
    include: {
      category: true,
      recurringRule: true,
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    notes: task.notes,
    dueDate: task.dueDate,
    isCompleted: task.isCompleted,
    isArchived: task.isArchived,
    category: task.category
      ? {
          name: task.category.name,
          color: task.category.color,
        }
      : null,
    recurringRule: task.recurringRule
      ? {
          type: task.recurringRule.type,
          frequency: task.recurringRule.frequency,
        }
      : null,
  }));
}
