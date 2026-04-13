import { PageShell } from '@/components/page-shell';
import { getHabits } from '@/services/habitService';
import { getPinnedNotes } from '@/services/noteService';
import { getTasks } from '@/services/taskService';

export default async function DashboardPage() {
  const [tasks, habits, pinnedNotes] = await Promise.all([getTasks(), getHabits(), getPinnedNotes()]);
  const today = new Date();

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    return task.dueDate.toDateString() === today.toDateString();
  });

  const weeklyTasks = tasks.filter((task) => task.recurringRule?.type === 'weekly');

  return (
    <PageShell title="Dashboard" description="A quick look at today and this week.">
      <div className="space-y-5 text-sm text-zinc-200">
        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-100">Today tasks</h2>
          {todayTasks.length === 0 ? (
            <p className="text-zinc-400">No tasks due today.</p>
          ) : (
            <ul className="space-y-2">
              {todayTasks.map((task) => (
                <li key={task.id} className="rounded-lg border border-zinc-800 p-3">
                  <p className="font-medium">{task.title}</p>
                  {task.category ? <p className="text-xs text-zinc-400">{task.category.name}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-100">Weekly tasks</h2>
          {weeklyTasks.length === 0 ? (
            <p className="text-zinc-400">No weekly flexible tasks yet.</p>
          ) : (
            <ul className="space-y-2">
              {weeklyTasks.map((task) => (
                <li key={task.id} className="rounded-lg border border-zinc-800 p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-zinc-400">Recurring weekly placeholder</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-100">Habits</h2>
          {habits.length === 0 ? (
            <p className="text-zinc-400">No habits yet.</p>
          ) : (
            <ul className="space-y-2">
              {habits.map((habit) => (
                <li key={habit.id} className="rounded-lg border border-zinc-800 p-3">
                  <p className="font-medium">{habit.title}</p>
                  <p className="text-xs text-zinc-400">
                    {habit.completionCount} completion(s), target {habit.targetCount}/{habit.frequencyType}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-100">Pinned notes</h2>
          {pinnedNotes.length === 0 ? (
            <p className="text-zinc-400">No pinned notes.</p>
          ) : (
            <ul className="space-y-2">
              {pinnedNotes.map((note) => (
                <li key={note.id} className="rounded-lg border border-zinc-800 p-3">
                  <p className="font-medium">{note.title}</p>
                  <p className="text-xs text-zinc-400">{note.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
