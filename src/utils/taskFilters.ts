import type { CompletionRecord, Task, TaskPriority } from '../models/task'
import { compareDateOnly, getTodayDateString, isCurrentWeek } from './date'

const priorityWeight: Record<TaskPriority, number> = {
  high: 0,
  normal: 1,
  low: 2,
}

export function isActiveTask(task: Task) {
  return task.status !== 'completed'
}

export function matchesTaskSearch(task: Task, query: string) {
  if (!query) {
    return true
  }

  const search = query.toLowerCase()
  return (
    task.title.toLowerCase().includes(search) ||
    (task.project ?? '').toLowerCase().includes(search)
  )
}

export function matchesCompletionSearch(record: CompletionRecord, query: string) {
  if (!query) {
    return true
  }

  const search = query.toLowerCase()
  return (
    record.title.toLowerCase().includes(search) ||
    (record.project ?? '').toLowerCase().includes(search)
  )
}

export function sortTasks(tasks: Task[], referenceDate = new Date()) {
  const today = getTodayDateString(referenceDate)

  return [...tasks].sort((left, right) => {
    const leftOverdue = left.dueDate !== null && left.dueDate < today ? 0 : 1
    const rightOverdue = right.dueDate !== null && right.dueDate < today ? 0 : 1

    if (leftOverdue !== rightOverdue) {
      return leftOverdue - rightOverdue
    }

    const priorityComparison =
      priorityWeight[left.priority] - priorityWeight[right.priority]

    if (priorityComparison !== 0) {
      return priorityComparison
    }

    const dueComparison = compareDateOnly(left.dueDate, right.dueDate)
    if (dueComparison !== 0) {
      return dueComparison
    }

    return left.createdAt.localeCompare(right.createdAt)
  })
}

export function getTodayGroups(tasks: Task[], referenceDate = new Date()) {
  const today = getTodayDateString(referenceDate)
  const activeTasks = tasks.filter((task) => task.status !== 'completed')
  const overdue = activeTasks.filter(
    (task) =>
      task.status !== 'waiting' &&
      task.dueDate !== null &&
      task.dueDate < today,
  )
  const current = activeTasks.filter(
    (task) =>
      task.status !== 'waiting' &&
      !overdue.some((overdueTask) => overdueTask.id === task.id) &&
      (task.status === 'today' || task.dueDate === today),
  )
  const waiting = getWaitingTasks(activeTasks)
  const upcoming = activeTasks.filter(
    (task) =>
      task.status !== 'waiting' &&
      !overdue.some((overdueTask) => overdueTask.id === task.id) &&
      !current.some((currentTask) => currentTask.id === task.id),
  )

  return {
    overdue: sortTasks(overdue, referenceDate),
    today: sortTasks(current, referenceDate),
    waiting,
    upcoming: sortTasks(upcoming, referenceDate),
  }
}

export function getInboxTasks(tasks: Task[], referenceDate = new Date()) {
  return sortTasks(
    tasks.filter((task) => task.status === 'inbox'),
    referenceDate,
  )
}

export function getWaitingTasks(tasks: Task[]) {
  return [...tasks]
    .filter((task) => task.status === 'waiting')
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
}

export function getRecurringTasks(tasks: Task[], referenceDate = new Date()) {
  return sortTasks(
    tasks.filter(
      (task) => task.recurrence !== 'none' && task.status !== 'completed',
    ),
    referenceDate,
  )
}

export function getWeeklyCompletionRecords(
  records: CompletionRecord[],
  referenceDate = new Date(),
) {
  return records
    .filter((record) => isCurrentWeek(record.completedAt, referenceDate))
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt))
}
