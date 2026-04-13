const DAY_IN_MS = 1000 * 60 * 60 * 24;

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function countHabitCompletionsWithinDays(completionDates: Date[], days: number, now = new Date()): number {
  const threshold = startOfUtcDay(now) - (days - 1) * DAY_IN_MS;

  return completionDates.reduce((count, completionDate) => {
    const completionDay = startOfUtcDay(completionDate);
    return completionDay >= threshold ? count + 1 : count;
  }, 0);
}
