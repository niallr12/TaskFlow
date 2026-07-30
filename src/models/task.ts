export const TASK_STATUSES = ['inbox', 'today', 'waiting', 'completed'] as const
export const TASK_PRIORITIES = ['low', 'normal', 'high'] as const
export const TASK_RECURRENCES = ['none', 'daily', 'weekly', 'monthly'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]
export type TaskRecurrence = (typeof TASK_RECURRENCES)[number]

export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  dueDate: string | null
  completedAt: string | null
  project: string | null
  recurrence: TaskRecurrence
}

export interface CompletionRecord {
  id: string
  taskId: string
  title: string
  completedAt: string
  project: string | null
}

export interface TaskDraft {
  title: string
  dueDate: string | null
  status: TaskStatus
  priority: TaskPriority
  project: string | null
}
