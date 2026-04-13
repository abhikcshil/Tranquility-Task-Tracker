import { addMilestoneAction, deleteMilestoneAction, updateWeeklyGoalAction } from '@/app/actions';
import { PageShell } from '@/components/page-shell';
import { getRewardMilestones, getWeeklyPointsGoal } from '@/services/settingsService';

export default async function SettingsPage() {
  const [weeklyGoal, milestones] = await Promise.all([
    getWeeklyPointsGoal(),
    getRewardMilestones(),
  ]);

  return (
    <PageShell title="Settings" description="Tune weekly goals, milestones, and default behavior.">
      <div className="space-y-4">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-semibold text-zinc-100">Weekly points goal</h2>
          <form action={updateWeeklyGoalAction} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min={0}
              name="weeklyGoal"
              defaultValue={weeklyGoal}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <button
              type="submit"
              className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300"
            >
              Save goal
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-semibold text-zinc-100">Reward milestones</h2>
          <p className="mt-1 text-sm text-zinc-400">Define simple rewards at point thresholds.</p>

          <form action={addMilestoneAction} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input
              name="label"
              placeholder="Reward label (e.g. takeout)"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 sm:col-span-2"
            />
            <input
              name="points"
              type="number"
              min={1}
              placeholder="Points"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <button
              type="submit"
              className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300 sm:col-span-3"
            >
              Add milestone
            </button>
          </form>

          <ul className="mt-4 space-y-2">
            {milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm"
              >
                <span className="text-zinc-100">
                  {milestone.points} pts = {milestone.label}
                </span>
                <form action={deleteMilestoneAction}>
                  <input type="hidden" name="milestoneId" value={milestone.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                  >
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
