const DAY_IN_MS = 1000 * 60 * 60 * 24;

export type HabitFrequencyType = 'daily' | 'weekly';

export type HabitProgress = {
  completed: number;
  target: number;
  isComplete: boolean;
};

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function isSameLocalDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function countHabitCompletionsWithinDays(completionDates: Date[], days: number, now = new Date()): number {
  const threshold = startOfUtcDay(now) - (days - 1) * DAY_IN_MS;

  return completionDates.reduce((count, completionDate) => {
    const completionDay = startOfUtcDay(completionDate);
    return completionDay >= threshold ? count + 1 : count;
  }, 0);
}

export function getHabitProgressForDateRange(completionDates: Date[], target: number): HabitProgress {
  const completed = completionDates.length;
  const safeTarget = Math.max(1, target);

  return {
    completed,
    target: safeTarget,
    isComplete: completed >= safeTarget,
  };
}

export function getHabitCurrentStreak(
  frequencyType: HabitFrequencyType,
  completionDates: Date[],
  now = new Date(),
): number {
  if (completionDates.length === 0) {
    return 0;
  }

  const uniqueDays = [...new Set(completionDates.map((date) => startOfUtcDay(date)))].sort((a, b) => b - a);

  if (frequencyType === 'daily') {
    const todayKey = startOfUtcDay(now);
    const yesterdayKey = todayKey - DAY_IN_MS;
    const startsFromToday = uniqueDays[0] === todayKey;
    const startsFromYesterday = uniqueDays[0] === yesterdayKey;

    if (!startsFromToday && !startsFromYesterday) {
      return 0;
    }

    let streak = 1;
    for (let index = 1; index < uniqueDays.length; index += 1) {
      if (uniqueDays[index - 1] - uniqueDays[index] !== DAY_IN_MS) {
        break;
      }
      streak += 1;
    }

    return streak;
  }

  const weekKeys = [...new Set(completionDates.map((date) => getStartOfWeek(date).getTime()))].sort((a, b) => b - a);
  const currentWeek = getStartOfWeek(now).getTime();
  const previousWeek = currentWeek - DAY_IN_MS * 7;

  if (weekKeys[0] !== currentWeek && weekKeys[0] !== previousWeek) {
    return 0;
  }

  let streak = 1;
  for (let index = 1; index < weekKeys.length; index += 1) {
    if (weekKeys[index - 1] - weekKeys[index] !== DAY_IN_MS * 7) {
      break;
    }
    streak += 1;
  }

  return streak;
}
