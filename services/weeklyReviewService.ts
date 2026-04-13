import {
  computeWeeklySummary,
  getPreviousWeekRange,
  selectCarryoverTasks,
} from '@/lib/weekly-review';
import { prisma } from '@/lib/prisma';
import { getCurrentWeekPoints } from '@/services/pointService';
import { getWeeklyPointsGoal } from '@/services/settingsService';
import { getTasks } from '@/services/taskService';

export async function getPreviousWeekSummary(today = new Date()) {
  const { start, end } = getPreviousWeekRange(today);

  const [pointsAggregate, completedTasks, missedTasks, habitsCompleted, weeklyGoal] =
    await Promise.all([
      prisma.pointEvent.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: start, lte: end } },
      }),
      prisma.task.count({ where: { isCompleted: true, updatedAt: { gte: start, lte: end } } }),
      prisma.task.count({
        where: { isCompleted: false, dueDate: { gte: start, lte: end }, isArchived: false },
      }),
      prisma.habitCompletion.count({ where: { date: { gte: start, lte: end } } }),
      getWeeklyPointsGoal(),
    ]);

  const totalPoints = pointsAggregate._sum.amount ?? 0;

  return {
    range: { start, end },
    ...computeWeeklySummary({
      totalPoints,
      tasksCompleted: completedTasks,
      tasksMissed: missedTasks,
      habitsCompleted,
      weeklyGoal,
    }),
  };
}

export async function getCarryoverCandidates(today = new Date()) {
  const tasks = await getTasks(today);
  return selectCarryoverTasks(tasks);
}

export async function runWeeklyReset(carryoverTaskIds: number[], today = new Date()) {
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  await prisma.$transaction(async (tx) => {
    await tx.task.updateMany({
      where: {
        id: { notIn: carryoverTaskIds },
        recurringRule: null,
        isCompleted: false,
        isArchived: false,
      },
      data: { isArchived: true },
    });

    await tx.taskInstance.deleteMany({
      where: {
        date: { lt: startOfWeek },
        task: {
          recurringRule: {
            is: { type: 'weekly' },
          },
        },
      },
    });
  });
}

export async function getWeeklyReviewProgress() {
  const [currentPoints, weeklyGoal] = await Promise.all([
    getCurrentWeekPoints(),
    getWeeklyPointsGoal(),
  ]);
  return {
    currentPoints,
    weeklyGoal,
    percent: weeklyGoal > 0 ? Math.min(100, Math.round((currentPoints / weeklyGoal) * 100)) : 0,
  };
}
