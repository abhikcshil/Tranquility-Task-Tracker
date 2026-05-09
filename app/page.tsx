import Link from 'next/link';
import { quickAddAction } from '@/app/actions';
import { HabitList } from '@/components/ui/habit-list';
import { CalendarWidget } from '@/components/ui/calendar-widget';
import { NoteList } from '@/components/ui/note-list';
import { ProgressRing } from '@/components/ui/progress-ring';
import { SectionCard } from '@/components/ui/section-card';
import { TaskList } from '@/components/ui/task-list';
import {
  computeDailyProgress,
  computeWeeklyPointsProgress,
  computeWeeklyTaskProgress,
  getDashboardTodayTasks,
  getPinnedNotesPreview,
  getWeekRange,
  getWeeklyTasks,
} from '@/lib/dashboard';
import { computeMilestoneProgress } from '@/lib/settings';
import { getHabits } from '@/services/habitService';
import { getPinnedNotes } from '@/services/noteService';
import { getCurrentWeekPoints } from '@/services/pointService';
import { getUpcomingReminders } from '@/services/reminderService';
import { getRewardMilestones, getWeeklyPointsGoal } from '@/services/settingsService';
import { getTasks } from '@/services/taskService';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [tasks, habits, pinnedNotes, weekPoints, weeklyGoal, milestones, upcomingReminders] =
    await Promise.all([
      getTasks(),
      getHabits(),
      getPinnedNotes(),
      getCurrentWeekPoints(),
      getWeeklyPointsGoal(),
      getRewardMilestones(),
      getUpcomingReminders(),
    ]);

  const today = new Date();
  const { start, end } = getWeekRange(today);

  const dailyProgress = computeDailyProgress(tasks, today);
  const weeklyTaskProgress = computeWeeklyTaskProgress(tasks);
  const weeklyPointsProgress = computeWeeklyPointsProgress(weekPoints, weeklyGoal);

  const todayTasks = getDashboardTodayTasks(tasks, today);
  const weeklyTasks = getWeeklyTasks(tasks);
  const pinnedNotesPreview = getPinnedNotesPreview(pinnedNotes);
  const milestoneProgress = computeMilestoneProgress(milestones, weekPoints);
  const calendarTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    isArchived: task.isArchived,
    isCompleted: task.isCompleted,
    pointValue: task.pointValue,
    category: task.category ? { name: task.category.name, color: task.category.color } : null,
    recurringRule: task.recurringRule,
    weeklyProgress: task.weeklyProgress,
  }));

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Tranquility Dashboard</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-100">
          Good focus, one step at a time
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}{' '}
          • Week of {start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
          {end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
        <div className="mt-5 flex items-start justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-2 py-3">
          <ProgressRing
            label="Daily"
            value={dailyProgress.percent}
            subtitle={`${dailyProgress.completed}/${dailyProgress.total}`}
            size={76}
            variant="compact"
          />
          <ProgressRing
            label="Weekly"
            value={weeklyTaskProgress.percent}
            subtitle={`${weeklyTaskProgress.completed}/${weeklyTaskProgress.total}`}
            size={76}
            variant="compact"
          />
          <ProgressRing
            label="Points"
            value={weeklyPointsProgress.percent}
            centerLabel={`${weekPoints} pts`}
            subtitle={`${weeklyPointsProgress.total} goal`}
            size={76}
            variant="compact"
          />
        </div>
      </section>

      <SectionCard title="Today tasks" description="One-time and due-now items.">
        <TaskList
          tasks={todayTasks}
          emptyTitle="No tasks due today"
          emptyMessage="Enjoy the extra room in your day."
          showCompletionToggle
          showEditLink
          compactCompleted
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

      <SectionCard title="Quick Add" description="Natural-feeling capture for tasks and habits.">
        <form action={quickAddAction} className="flex flex-col gap-2 sm:flex-row">
          <input
            required
            name="quickAdd"
            placeholder='Try: "Call mom tomorrow" or "Take vitamins daily"'
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-sky-500/40 focus:ring"
          />
          <button
            type="submit"
            className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300"
          >
            Capture
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Habits" description="Progress snapshots from your current habits.">
        <HabitList habits={habits} />
      </SectionCard>

      <SectionCard title="Upcoming reminders" description="Pending reminders from task scheduling.">
        {upcomingReminders.length === 0 ? (
          <p className="text-sm text-zinc-400">No upcoming reminders.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {upcomingReminders.map((task) => (
              <li
                key={task.id}
                className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-zinc-200"
              >
                {task.title} • {task.reminderAt?.toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <CalendarWidget tasks={calendarTasks} />

      <SectionCard title="Pinned notes" description="Keep key context visible.">
        <NoteList
          notes={pinnedNotesPreview}
          emptyTitle="No pinned notes"
          emptyMessage="Pin a note in a later phase to keep it at the top."
        />
      </SectionCard>

      <SectionCard title="Reward milestones" description="Your weekly motivation ladder.">
        {milestoneProgress.length === 0 ? (
          <p className="text-sm text-zinc-400">No milestones yet. Add them in Settings.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {milestoneProgress.map((milestone) => (
              <li
                key={milestone.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2"
              >
                <span className="text-zinc-100">
                  {milestone.points} pts = {milestone.label}
                </span>
                <span className={milestone.reached ? 'text-emerald-300' : 'text-zinc-400'}>
                  {milestone.reached ? 'Reached' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/focus"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-sky-500/50 hover:text-sky-300"
        >
          Open Focus Mode
        </Link>
        <Link
          href="/weekly-review"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-sky-500/50 hover:text-sky-300"
        >
          Weekly Review
        </Link>
      </section>
    </div>
  );
}
