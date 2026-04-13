import { SectionCard } from '@/components/ui/section-card';
import { TaskList } from '@/components/ui/task-list';
import { getTasks } from '@/services/taskService';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-4">
      <header className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-100">Tasks</h1>
        <p className="text-sm text-zinc-400">All active tasks from your local database.</p>
      </header>

      <SectionCard title="Active tasks" description="Read-only view for Phase 2 polish.">
        <TaskList tasks={tasks} emptyTitle="No tasks yet" emptyMessage="You will add and edit tasks in a later phase." />
      </SectionCard>
    </div>
  );
}
