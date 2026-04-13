import { prisma } from '@/lib/prisma';
import { validateMilestoneInput, validateWeeklyGoal } from '@/lib/validation';

const WEEKLY_GOAL_KEY = 'weeklyPointsGoal';
const DEFAULT_WEEKLY_POINTS_GOAL = 100;

export type RewardMilestoneItem = {
  id: number;
  label: string;
  points: number;
};

export async function getWeeklyPointsGoal(): Promise<number> {
  const setting = await prisma.appSetting.findUnique({ where: { key: WEEKLY_GOAL_KEY } });
  if (!setting) {
    return DEFAULT_WEEKLY_POINTS_GOAL;
  }

  const parsed = Number.parseInt(setting.value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_WEEKLY_POINTS_GOAL;
  }

  return parsed;
}

export async function setWeeklyPointsGoal(goal: number): Promise<number> {
  const valid = validateWeeklyGoal(goal);

  await prisma.appSetting.upsert({
    where: { key: WEEKLY_GOAL_KEY },
    create: { key: WEEKLY_GOAL_KEY, value: String(valid) },
    update: { value: String(valid) },
  });

  return valid;
}

export async function getRewardMilestones(): Promise<RewardMilestoneItem[]> {
  return prisma.rewardMilestone.findMany({
    orderBy: [{ points: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      label: true,
      points: true,
    },
  });
}

export async function saveRewardMilestone(label: string, points: number): Promise<void> {
  const valid = validateMilestoneInput({ label, points });

  await prisma.rewardMilestone.create({
    data: valid,
  });
}

export async function deleteRewardMilestone(id: number): Promise<void> {
  await prisma.rewardMilestone.delete({ where: { id } });
}
