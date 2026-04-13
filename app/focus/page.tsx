import Link from 'next/link';
import { TaskList } from '@/components/ui/task-list';
import { selectFocusTasks } from '@/lib/dashboard';
import { getTasks } from '@/services/taskService';

export default async function FocusPage() {
  const tasks = await getTasks();
  const focusTasks = selectFocusTasks(tasks, new Date(), 3);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Focus Mode</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Top 3 priorities</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Overdue tasks first, then today, then oldest incomplete tasks.
        </p>
      </section>

      <TaskList
        tasks={focusTasks}
        emptyTitle="All clear"
        emptyMessage="No incomplete tasks are available for focus right now."
      />

      <div className="text-center">
        <Link href="/" className="text-sm text-sky-300 hover:text-sky-200">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
