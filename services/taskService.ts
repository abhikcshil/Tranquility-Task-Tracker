import { prisma } from '@/lib/prisma';
import { getEndOfWeek, getStartOfWeek } from '@/lib/habits';
import { validateTaskInput, type TaskInput } from '@/lib/validation';

export type TaskListItem = {
  id: number;
  title: string;
  notes: string | null;
  categoryId: number | null;
  dueDate: Date | null;
  reminderAt: Date | null;
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
    daysOfWeek: string | null;
  } | null;
  weeklyProgress: {
    completed: number;
    target: number;
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

function toTaskListItem(task: any, weekStart: Date, weekEnd: Date): TaskListItem {
  const weeklyTarget =
    task.recurringRule?.type === 'weekly' ? (task.recurringRule.frequency ?? 1) : null;
  const weeklyCompleted =
    task.recurringRule?.type === 'weekly'
      ? task.instances.filter((instance: { date: Date; completed: boolean }) => {
          return instance.completed && instance.date >= weekStart && instance.date <= weekEnd;
        }).length
      : 0;

  return {
    id: task.id,
    title: task.title,
    notes: task.notes,
    categoryId: task.categoryId,
    dueDate: task.dueDate,
    reminderAt: task.reminderAt,
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
          daysOfWeek: task.recurringRule.daysOfWeek,
        }
      : null,
    weeklyProgress: weeklyTarget
      ? {
          completed: weeklyCompleted,
          target: weeklyTarget,
        }
      : null,
  };
}

export function getTaskCompletionPlan(isCompleted: boolean): TaskCompletionPlan {
  if (isCompleted) {
    return { nextCompleted: false, pointEventAction: 'delete' };
  }

  return { nextCompleted: true, pointEventAction: 'create' };
}

export async function getTasks(today = new Date()): Promise<TaskListItem[]> {
  const weekStart = getStartOfWeek(today);
  const weekEnd = getEndOfWeek(today);

  const tasks = await prisma.task.findMany({
    where: { isArchived: false },
    include: {
      category: true,
      recurringRule: true,
      instances: {
        where: {
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      },
    },
    orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }, { createdAt: 'asc' }],
  });

  return tasks.map((task) => toTaskListItem(task, weekStart, weekEnd));
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
      reminderAt: valid.reminderAt,
      pointValue: valid.pointValue,
      recurringRule: valid.recurrence
        ? {
            create: {
              type: valid.recurrence.type,
              frequency: valid.recurrence.frequency,
              daysOfWeek: valid.recurrence.daysOfWeek,
            },
          }
        : undefined,
    },
    include: {
      category: true,
      recurringRule: true,
      instances: true,
    },
  });

  const weekStart = getStartOfWeek(new Date());
  const weekEnd = getEndOfWeek(new Date());
  return toTaskListItem(task, weekStart, weekEnd);
}

export async function updateTask(taskId: number, input: TaskInput): Promise<TaskListItem> {
  const valid = validateTaskInput(input);

  const task = await prisma.$transaction(async (tx) => {
    const updated = await tx.task.update({
      where: { id: taskId },
      data: {
        title: valid.title,
        notes: valid.notes,
        categoryId: valid.categoryId,
        dueDate: valid.dueDate,
        reminderAt: valid.reminderAt,
        pointValue: valid.pointValue,
      },
      include: {
        category: true,
        recurringRule: true,
        instances: true,
      },
    });

    if (!valid.recurrence && updated.recurringRule) {
      await tx.recurringRule.delete({ where: { taskId } });
    }

    if (valid.recurrence && updated.recurringRule) {
      await tx.recurringRule.update({
        where: { taskId },
        data: {
          type: valid.recurrence.type,
          frequency: valid.recurrence.frequency,
          daysOfWeek: valid.recurrence.daysOfWeek,
        },
      });
    }

    if (valid.recurrence && !updated.recurringRule) {
      await tx.recurringRule.create({
        data: {
          taskId,
          type: valid.recurrence.type,
          frequency: valid.recurrence.frequency,
          daysOfWeek: valid.recurrence.daysOfWeek,
        },
      });
    }

    return tx.task.findUniqueOrThrow({
      where: { id: taskId },
      include: { category: true, recurringRule: true, instances: true },
    });
  });

  const weekStart = getStartOfWeek(new Date());
  const weekEnd = getEndOfWeek(new Date());
  return toTaskListItem(task, weekStart, weekEnd);
}

export async function toggleTaskCompletion(taskId: number): Promise<TaskListItem> {
  return prisma.$transaction(async (tx) => {
    const today = new Date();
    const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const existing = await tx.task.findUniqueOrThrow({
      where: { id: taskId },
      include: { category: true, recurringRule: true, instances: true },
    });

    if (existing.recurringRule?.type === 'weekly') {
      const existingInstance = await tx.taskInstance.findUnique({
        where: {
          taskId_date: {
            taskId,
            date: todayKey,
          },
        },
      });

      if (existingInstance?.completed) {
        await tx.taskInstance.delete({ where: { id: existingInstance.id } });
        const event = await tx.pointEvent.findFirst({
          where: { sourceType: 'task-instance', sourceId: existingInstance.id },
        });
        if (event) {
          await tx.pointEvent.delete({ where: { id: event.id } });
        }
      } else {
        const instance = await tx.taskInstance.upsert({
          where: { taskId_date: { taskId, date: todayKey } },
          create: { taskId, date: todayKey, completed: true, pointsAwarded: existing.pointValue },
          update: { completed: true, pointsAwarded: existing.pointValue },
        });

        await tx.pointEvent.deleteMany({
          where: { sourceType: 'task-instance', sourceId: instance.id },
        });

        await tx.pointEvent.create({
          data: {
            amount: existing.pointValue,
            sourceType: 'task-instance',
            sourceId: instance.id,
          },
        });
      }

      const task = await tx.task.findUniqueOrThrow({
        where: { id: taskId },
        include: { category: true, recurringRule: true, instances: true },
      });
      const weekStart = getStartOfWeek(today);
      const weekEnd = getEndOfWeek(today);
      return toTaskListItem(task, weekStart, weekEnd);
    }

    const plan = getTaskCompletionPlan(existing.isCompleted);

    const task = await tx.task.update({
      where: { id: taskId },
      data: { isCompleted: plan.nextCompleted },
      include: { category: true, recurringRule: true, instances: true },
    });

    if (plan.pointEventAction === 'create') {
      await tx.pointEvent.deleteMany({
        where: {
          sourceType: 'task',
          sourceId: existing.id,
        },
      });

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

    const weekStart = getStartOfWeek(today);
    const weekEnd = getEndOfWeek(today);
    return toTaskListItem(task, weekStart, weekEnd);
  });
}

export async function archiveTask(taskId: number): Promise<void> {
  await prisma.task.update({
    where: { id: taskId },
    data: { isArchived: true },
  });
}
