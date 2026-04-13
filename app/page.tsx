import Link from 'next/link';
import { HabitList } from '@/components/ui/habit-list';
import { NoteList } from '@/components/ui/note-list';
import { ProgressRing } from '@/components/ui/progress-ring';
import { SectionCard } from '@/components/ui/section-card';
import { TaskList } from '@/components/ui/task-list';
import {
  computeDailyProgress,
  computeWeeklyPointsProgress,
  computeWeeklyTaskProgress,
  getPinnedNotesPreview,
  getTodayTasks,
  getWeekRange,
  getWeeklyTasks,
  WEEKLY_POINTS_GOAL,
} from '@/lib/dashboard';
import { getHabits } from '@/services/habitService';
import { getNotes, getPinnedNotes } from '@/services/noteService';
import { getCurrentWeekPoints } from '@/services/pointService';
import { getTasks } from '@/services/taskService';

export default async function DashboardPage() {
  const [tasks, habits, pinnedNotes, notes, weekPoints] = await Promise.all([
    getTasks(),
    getHabits(),
    getPinnedNotes(),
    getNotes(),
    getCurrentWeekPoints(),
  ]);

  const today = new Date();
  const { start, end } = getWeekRange(today);

  const dailyProgress = computeDailyProgress(tasks, today);
  const weeklyTaskProgress = computeWeeklyTaskProgress(tasks);
  const weeklyPointsProgress = computeWeeklyPointsProgress(weekPoints, WEEKLY_POINTS_GOAL);

  const todayTasks = getTodayTasks(tasks, today);
  const weeklyTasks = getWeeklyTasks(tasks);
  const pinnedNotesPreview = getPinnedNotesPreview(pinnedNotes);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Tranquility Dashboard</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-100">Good focus, one step at a time</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} • Week of{' '}
          {start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
          {end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
        <p className="mt-3 text-sm text-zinc-300">
          {todayTasks.length} today task(s), {weeklyTasks.length} weekly task(s), {habits.length} habit(s), {notes.length} note(s).
        </p>
        <Link
          href="/focus"
          className="mt-4 inline-flex rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300"
        >
          Open Focus Mode
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ProgressRing
          label="Daily progress"
          value={dailyProgress.percent}
          subtitle={`${dailyProgress.completed}/${dailyProgress.total} complete`}
        />
        <ProgressRing
          label="Weekly tasks"
          value={weeklyTaskProgress.percent}
          subtitle={`${weeklyTaskProgress.completed}/${weeklyTaskProgress.total} complete`}
        />
        <ProgressRing
          label="Weekly points"
          value={weeklyPointsProgress.percent}
          subtitle={`${weeklyPointsProgress.completed}/${weeklyPointsProgress.total} pts`}
        />
      </section>

      <SectionCard title="Today tasks" description="One-time and due-now items.">
        <TaskList
          tasks={todayTasks}
          emptyTitle="No tasks due today"
          emptyMessage="Enjoy the extra room in your day."
          showCompletionToggle
          showEditLink
        />
      </SectionCard>

      <SectionCard title="This week tasks" description="Flexible weekly tasks.">
        <TaskList
          tasks={weeklyTasks}
          emptyTitle="No weekly tasks"
          emptyMessage="Weekly recurring tasks will show up here."
          showCompletionToggle
          showEditLink
        />
      </SectionCard>

      <SectionCard title="Habits" description="Progress snapshots from your current habits.">
        <HabitList habits={habits} />
      </SectionCard>

      <SectionCard title="Pinned notes" description="Keep key context visible.">
        <NoteList
          notes={pinnedNotesPreview}
          emptyTitle="No pinned notes"
          emptyMessage="Pin a note in a later phase to keep it at the top."
        />
      </SectionCard>
    </div>
  );
}
