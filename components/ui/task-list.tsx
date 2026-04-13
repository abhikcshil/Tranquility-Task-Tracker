import type { TaskListItem } from '@/services/taskService';
import { EmptyState } from '@/components/ui/empty-state';

type TaskListProps = {
  tasks: TaskListItem[];
  emptyTitle: string;
  emptyMessage: string;
};

export function TaskList({ tasks, emptyTitle, emptyMessage }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <ul className="space-y-2 text-sm">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3"
          style={{ borderLeftColor: task.category?.color ?? '#3f3f46', borderLeftWidth: '3px' }}
        >
          <p className="font-medium text-zinc-100">{task.title}</p>
          {task.notes ? <p className="mt-1 text-xs text-zinc-400">{task.notes}</p> : null}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span>{task.category?.name ?? 'Uncategorized'}</span>
            {task.dueDate ? <span>Due {task.dueDate.toLocaleDateString()}</span> : null}
            {task.recurringRule ? <span>{task.recurringRule.type}</span> : null}
            {task.isCompleted ? <span className="text-emerald-400">Completed</span> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
