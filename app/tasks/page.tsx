import { PageShell } from '@/components/page-shell';
import { getTasks } from '@/services/taskService';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <PageShell title="Tasks" description="All active tasks from the database.">
      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-300">No tasks yet.</p>
      ) : (
        <ul className="space-y-2 text-sm text-zinc-200">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-lg border border-zinc-800 p-3">
              <p className="font-medium">{task.title}</p>
              {task.notes ? <p className="text-xs text-zinc-400">{task.notes}</p> : null}
              <p className="text-xs text-zinc-500">
                {task.category ? task.category.name : 'Uncategorized'}
                {task.dueDate ? ` • Due ${task.dueDate.toLocaleDateString()}` : ''}
                {task.recurringRule ? ` • ${task.recurringRule.type}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
