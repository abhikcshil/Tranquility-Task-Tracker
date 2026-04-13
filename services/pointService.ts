import { prisma } from '@/lib/prisma';
import { getWeekRange } from '@/lib/dashboard';

export async function getCurrentWeekPoints(today = new Date()): Promise<number> {
  const { start, end } = getWeekRange(today);

  const result = await prisma.pointEvent.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  return result._sum.amount ?? 0;
}
