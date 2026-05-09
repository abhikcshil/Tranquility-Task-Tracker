type TaskVisualInput = {
  isCompleted: boolean;
  weeklyProgress?: {
    completed: number;
    target: number;
  } | null;
  category?: {
    color: string;
  } | null;
};

export type TaskVisualStatus = 'complete' | 'incomplete';

export function getTaskVisualStatus(task: TaskVisualInput): TaskVisualStatus {
  if (task.weeklyProgress) {
    return task.weeklyProgress.completed >= task.weeklyProgress.target ? 'complete' : 'incomplete';
  }

  return task.isCompleted ? 'complete' : 'incomplete';
}

export function getTaskCompletionCueColor(task: TaskVisualInput): string {
  return getTaskVisualStatus(task) === 'complete' ? '#34d399' : '#facc15';
}

export function getTaskCategoryCueColor(task: TaskVisualInput): string {
  return task.category?.color ?? '#52525b';
}
