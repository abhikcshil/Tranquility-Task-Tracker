import { runWeeklyResetAction } from '@/app/actions';
import { PageShell } from '@/components/page-shell';
import { SubmitButton } from '@/components/ui/submit-button';
import { formatDisplayDate } from '@/lib/dates';
import {
  getCarryoverCandidates,
  getPreviousWeekSummary,
  getWeeklyReviewProgress,
} from '@/services/weeklyReviewService';

export default async function WeeklyReviewPage() {
  const [summary, carryover, progress] = await Promise.all([
    getPreviousWeekSummary(),
    getCarryoverCandidates(),
    getWeeklyReviewProgress(),
  ]);

  return (
    <PageShell title="Weekly Review" description="Close out last week and prep this one.">
      <div className="space-y-4">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm">
          <h2 className="text-lg font-semibold text-zinc-100">Previous week summary</h2>
          <p className="mt-2 text-zinc-300">
            {formatDisplayDate(summary.range.start, { month: 'short', day: 'numeric' })} -{' '}
            {formatDisplayDate(summary.range.end, { month: 'short', day: 'numeric' })}
          </p>
          <ul className="mt-3 space-y-1 text-zinc-300">
            <li>
              Total points: <span className="text-zinc-100">{summary.totalPoints}</span>
            </li>
            <li>
              Tasks completed: <span className="text-zinc-100">{summary.tasksCompleted}</span>
            </li>
            <li>
              Tasks missed: <span className="text-zinc-100">{summary.tasksMissed}</span>
            </li>
            <li>
              Habit completions: <span className="text-zinc-100">{summary.habitsCompleted}</span>
            </li>
            <li>
              Weekly goal:{' '}
              <span className={summary.goalHit ? 'text-emerald-300' : 'text-amber-300'}>
                {summary.goalHit ? 'Hit' : 'Not hit'} ({summary.totalPoints}/{summary.weeklyGoal})
              </span>
            </li>
          </ul>
          <p className="mt-3 text-zinc-400">
            Current week progress: {progress.currentPoints}/{progress.weeklyGoal} (
            {progress.percent}%)
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-semibold text-zinc-100">Carryover tasks</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Keep the tasks that still matter, archive the rest with one reset.
          </p>

          <form action={runWeeklyResetAction} className="mt-3 space-y-3">
            {carryover.length === 0 ? (
              <p className="text-sm text-zinc-400">No carryover candidates available.</p>
            ) : (
              <ul className="space-y-2">
                {carryover.map((task) => (
                  <li
                    key={task.id}
                    className="pressable rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-200"
                  >
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="carryoverTaskId"
                        defaultChecked
                        value={task.id}
                      />
                      <span>
                        {task.title}
                        {task.recurringRule ? ' (recurring)' : ''}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <SubmitButton
              pendingLabel="Resetting..."
              className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300 transition active:scale-[0.98]"
            >
              Run weekly reset
            </SubmitButton>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
