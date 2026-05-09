import Link from 'next/link';
import type { TaskListItem } from '@/services/taskService';
import { EmptyState } from '@/components/ui/empty-state';
import { toggleTaskCompletionAction } from '@/app/tasks/actions';
import { formatTaskDueLabel } from '@/lib/dates';
import { describeRecurringRule, type RecurringType } from '@/lib/recurrence';
import { getTaskCategoryCueColor, getTaskCompletionCueColor } from '@/lib/task-visuals';

type TaskListProps = {
  tasks: TaskListItem[];
  emptyTitle: string;
  emptyMessage: string;
  showCompletionToggle?: boolean;
  showEditLink?: boolean;
  compactCompleted?: boolean;
};

const recurringTypes = new Set<RecurringType>(['daily', 'weekdays', 'weekly', 'monthly', 'yearly']);

function isRecurringType(value: string): value is RecurringType {
  return recurringTypes.has(value as RecurringType);
}

export function TaskList({
  tasks,
  emptyTitle,
  emptyMessage,
  showCompletionToggle = false,
  showEditLink = false,
  compactCompleted = false,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <ul className="space-y-2 text-sm">
      {tasks.map((task) => {
        const isCompact = compactCompleted && task.isCompleted;
        const recurrence =
          task.recurringRule && isRecurringType(task.recurringRule.type)
            ? describeRecurringRule(
                task.recurringRule.type,
                task.recurringRule.frequency,
                task.recurringRule.daysOfWeek,
              )
            : null;

        return (
          <li
            key={task.id}
            className={`rounded-xl border border-zinc-800 bg-zinc-950/80 ${isCompact ? 'px-3 py-2 opacity-80' : 'p-3'}`}
            style={{
              borderLeftColor: getTaskCompletionCueColor(task),
              borderLeftWidth: '3px',
              borderRightColor: getTaskCategoryCueColor(task),
              borderRightWidth: '3px',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p
                className={`font-medium ${isCompact ? 'text-sm text-zinc-400 line-through' : 'text-zinc-100'}`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2">
                {showEditLink ? (
                  <Link
                    href="/tasks"
                    className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
                  >
                    Edit
                  </Link>
                ) : null}
                {showCompletionToggle ? (
                  <form action={toggleTaskCompletionAction}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                    >
                      {task.isCompleted
                        ? 'Mark incomplete'
                        : task.recurringRule?.type === 'weekly'
                          ? 'Log today'
                          : 'Mark complete'}
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
            {!isCompact && task.notes ? (
              <p className="mt-1 text-xs text-zinc-400">{task.notes}</p>
            ) : null}
            {!isCompact ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span>{task.category?.name ?? 'Uncategorized'}</span>
                {task.dueDate ? <span>{formatTaskDueLabel(task.dueDate)}</span> : null}
                {recurrence ? <span>{recurrence.details}</span> : null}
                {task.weeklyProgress ? (
                  <span>
                    {task.weeklyProgress.completed}/{task.weeklyProgress.target} this week
                  </span>
                ) : null}
                <span>{task.pointValue} pts</span>
                {task.isCompleted ? <span className="text-emerald-400">Completed</span> : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
