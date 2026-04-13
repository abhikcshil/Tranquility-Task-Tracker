import { prisma } from '@/lib/prisma';
import { validateTaskInput, type TaskInput } from '@/lib/validation';

export type TaskListItem = {
  id: number;
  title: string;
  notes: string | null;
  categoryId: number | null;
  dueDate: Date | null;
  pointValue: number;
  isCompleted: boolean;
  isArchived: boolean;
  createdAt: Date;
  category: {
    id: number;
    name: string;
    color: string;
  } | null;
  recurringRule: {
    type: string;
    frequency: number | null;
  } | null;
};

export type CategoryOption = {
  id: number;
  name: string;
  color: string;
};

export type TaskCompletionPlan = {
  nextCompleted: boolean;
  pointEventAction: 'create' | 'delete';
};

export function getTaskCompletionPlan(isCompleted: boolean): TaskCompletionPlan {
  if (isCompleted) {
    return { nextCompleted: false, pointEventAction: 'delete' };
  }

  return { nextCompleted: true, pointEventAction: 'create' };
}

export async function getTasks(): Promise<TaskListItem[]> {
  const tasks = await prisma.task.findMany({
    where: { isArchived: false },
    include: {
      category: true,
      recurringRule: true,
    },
    orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }, { createdAt: 'asc' }],
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    notes: task.notes,
    categoryId: task.categoryId,
    dueDate: task.dueDate,
    pointValue: task.pointValue,
    isCompleted: task.isCompleted,
    isArchived: task.isArchived,
    createdAt: task.createdAt,
    category: task.category
      ? {
          id: task.category.id,
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

export async function getTaskCategories(): Promise<CategoryOption[]> {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });
}

export async function createTask(input: TaskInput): Promise<TaskListItem> {
  const valid = validateTaskInput(input);

  const task = await prisma.task.create({
    data: {
      title: valid.title,
      notes: valid.notes,
      categoryId: valid.categoryId,
      dueDate: valid.dueDate,
      pointValue: valid.pointValue,
    },
    include: {
      category: true,
      recurringRule: true,
    },
  });

  return {
    id: task.id,
    title: task.title,
    notes: task.notes,
    categoryId: task.categoryId,
    dueDate: task.dueDate,
    pointValue: task.pointValue,
    isCompleted: task.isCompleted,
    isArchived: task.isArchived,
    createdAt: task.createdAt,
    category: task.category
      ? {
          id: task.category.id,
          name: task.category.name,
          color: task.category.color,
        }
      : null,
    recurringRule: null,
  };
}

export async function updateTask(taskId: number, input: TaskInput): Promise<TaskListItem> {
  const valid = validateTaskInput(input);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: valid.title,
      notes: valid.notes,
      categoryId: valid.categoryId,
      dueDate: valid.dueDate,
      pointValue: valid.pointValue,
    },
    include: {
      category: true,
      recurringRule: true,
    },
  });

  return {
    id: task.id,
    title: task.title,
    notes: task.notes,
    categoryId: task.categoryId,
    dueDate: task.dueDate,
    pointValue: task.pointValue,
    isCompleted: task.isCompleted,
    isArchived: task.isArchived,
    createdAt: task.createdAt,
    category: task.category
      ? {
          id: task.category.id,
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
  };
}

export async function toggleTaskCompletion(taskId: number): Promise<TaskListItem> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.task.findUniqueOrThrow({
      where: { id: taskId },
      include: { category: true, recurringRule: true },
    });

    const plan = getTaskCompletionPlan(existing.isCompleted);

    const task = await tx.task.update({
      where: { id: taskId },
      data: { isCompleted: plan.nextCompleted },
      include: { category: true, recurringRule: true },
    });

    if (plan.pointEventAction === 'create') {
      await tx.pointEvent.create({
        data: {
          amount: existing.pointValue,
          sourceType: 'task',
          sourceId: existing.id,
        },
      });
    } else {
      const latestEvent = await tx.pointEvent.findFirst({
        where: {
          sourceType: 'task',
          sourceId: existing.id,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (latestEvent) {
        await tx.pointEvent.delete({
          where: { id: latestEvent.id },
        });
      }
    }

    return {
      id: task.id,
      title: task.title,
      notes: task.notes,
      categoryId: task.categoryId,
      dueDate: task.dueDate,
      pointValue: task.pointValue,
      isCompleted: task.isCompleted,
      isArchived: task.isArchived,
      createdAt: task.createdAt,
      category: task.category
        ? {
            id: task.category.id,
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
    };
  });
}

export async function archiveTask(taskId: number): Promise<void> {
  await prisma.task.update({
    where: { id: taskId },
    data: { isArchived: true },
  });
}
