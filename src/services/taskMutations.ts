import type { CompletionRecord, Task, TaskDraft, TaskStatus } from '../models/task'
import { taskflowDb } from './db'
import { getTodayDateString } from '../utils/date'
import { parseCaptureInput } from '../utils/taskParser'
import { getNextRecurringDueDate } from '../utils/taskRecurrence'

function normalizeOptionalText(value: string | null | undefined) {
  const normalized = value?.trim() ?? ''
  return normalized ? normalized : null
}

function inferOpenStatus(task: Task, referenceDate = new Date()): TaskStatus {
  const today = getTodayDateString(referenceDate)
  if (task.dueDate !== null && task.dueDate <= today) {
    return 'today'
  }

  return 'inbox'
}

async function addCompletionRecord(task: Task, completedAt: string) {
  const record: CompletionRecord = {
    id: crypto.randomUUID(),
    taskId: task.id,
    title: task.title,
    completedAt,
    project: task.project,
  }

  await taskflowDb.completionRecords.add(record)
}

async function removeMatchingCompletionRecord(task: Task) {
  if (!task.completedAt) {
    return
  }

  const records = await taskflowDb.completionRecords
    .where('taskId')
    .equals(task.id)
    .toArray()

  const matchingRecord = records.find(
    (record) => record.completedAt === task.completedAt,
  )

  if (matchingRecord) {
    await taskflowDb.completionRecords.delete(matchingRecord.id)
  }
}

async function completeTask(task: Task, referenceDate = new Date()) {
  const completedAt = referenceDate.toISOString()
  await addCompletionRecord(task, completedAt)

  if (task.recurrence !== 'none') {
    const nextDueDate = getNextRecurringDueDate(
      task.dueDate,
      task.recurrence,
      referenceDate,
    )

    await taskflowDb.tasks.put({
      ...task,
      dueDate: nextDueDate,
      status: nextDueDate === getTodayDateString(referenceDate) ? 'today' : 'inbox',
      completedAt: null,
    })

    return
  }

  await taskflowDb.tasks.put({
    ...task,
    status: 'completed',
    completedAt,
  })
}

export async function createCapturedTask(input: string, referenceDate = new Date()) {
  const trimmedInput = input.trim()
  if (!trimmedInput) {
    return null
  }

  const parsed = parseCaptureInput(trimmedInput, referenceDate)
  const task: Task = {
    id: crypto.randomUUID(),
    title: parsed.title,
    status: parsed.status,
    priority: 'normal',
    createdAt: referenceDate.toISOString(),
    dueDate: parsed.dueDate,
    completedAt: null,
    project: parsed.project,
    recurrence: parsed.recurrence,
  }

  await taskflowDb.tasks.add(task)
  return task
}

export async function toggleTaskCompletion(task: Task, referenceDate = new Date()) {
  await taskflowDb.transaction(
    'rw',
    taskflowDb.tasks,
    taskflowDb.completionRecords,
    async () => {
      if (task.status === 'completed') {
        await removeMatchingCompletionRecord(task)
        await taskflowDb.tasks.put({
          ...task,
          status: inferOpenStatus(task, referenceDate),
          completedAt: null,
        })
        return
      }

      await completeTask(task, referenceDate)
    },
  )
}

export async function updateTaskDraft(
  originalTask: Task,
  draft: TaskDraft,
  referenceDate = new Date(),
) {
  const nextTask: Task = {
    ...originalTask,
    title: draft.title.trim() || originalTask.title,
    dueDate: normalizeOptionalText(draft.dueDate),
    status: draft.status,
    priority: draft.priority,
    project: normalizeOptionalText(draft.project),
  }

  await taskflowDb.transaction(
    'rw',
    taskflowDb.tasks,
    taskflowDb.completionRecords,
    async () => {
      if (originalTask.status !== 'completed' && nextTask.status === 'completed') {
        await completeTask(nextTask, referenceDate)
        return
      }

      if (originalTask.status === 'completed' && nextTask.status !== 'completed') {
        await removeMatchingCompletionRecord(originalTask)
        await taskflowDb.tasks.put({
          ...nextTask,
          completedAt: null,
        })
        return
      }

      await taskflowDb.tasks.put({
        ...nextTask,
        completedAt: nextTask.status === 'completed' ? originalTask.completedAt : null,
      })
    },
  )
}

export async function moveTaskToStatus(task: Task, status: TaskStatus) {
  await taskflowDb.tasks.put({
    ...task,
    status,
    completedAt: status === 'completed' ? task.completedAt : null,
  })
}

export async function deleteTask(taskId: string) {
  await taskflowDb.transaction(
    'rw',
    taskflowDb.tasks,
    taskflowDb.completionRecords,
    async () => {
      await taskflowDb.tasks.delete(taskId)

      const records = await taskflowDb.completionRecords
        .where('taskId')
        .equals(taskId)
        .toArray()

      if (records.length > 0) {
        await taskflowDb.completionRecords.bulkDelete(records.map((record) => record.id))
      }
    },
  )
}
