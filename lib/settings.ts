export type MilestoneProgress = {
  id: number;
  label: string;
  points: number;
  reached: boolean;
};

export function computeMilestoneProgress(
  milestones: Array<{ id: number; label: string; points: number }>,
  weeklyPoints: number,
): MilestoneProgress[] {
  return [...milestones]
    .sort((a, b) => a.points - b.points)
    .map((milestone) => ({
      ...milestone,
      reached: weeklyPoints >= milestone.points,
    }));
}
