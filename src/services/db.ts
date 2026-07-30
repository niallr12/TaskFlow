import Dexie, { type EntityTable } from 'dexie'
import type { CompletionRecord, Task } from '../models/task'

class TaskFlowDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  completionRecords!: EntityTable<CompletionRecord, 'id'>

  constructor() {
    super('taskflow')

    this.version(1).stores({
      tasks: 'id, status, priority, createdAt, dueDate, completedAt, project, recurrence',
      completionRecords: 'id, taskId, completedAt, project',
    })

    this.version(2)
      .stores({
        tasks:
          'id, status, priority, createdAt, dueDate, completedAt, project, recurrence, waitingOn',
        completionRecords: 'id, taskId, completedAt, project',
      })
      .upgrade((transaction) =>
        transaction
          .table('tasks')
          .toCollection()
          .modify((task: Task) => {
            task.waitingOn ??= null
          }),
      )
  }
}

export const taskflowDb = new TaskFlowDatabase()
