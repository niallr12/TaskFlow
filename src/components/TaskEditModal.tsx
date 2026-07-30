import { type FormEvent, useEffect, useState } from 'react'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskDraft,
} from '../models/task'

interface TaskEditModalProps {
  task: Task | null
  onClose: () => void
  onSave: (task: Task, draft: TaskDraft) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
}

const defaultDraft: TaskDraft = {
  title: '',
  dueDate: null,
  status: 'inbox',
  priority: 'normal',
  project: null,
}

export function TaskEditModal({
  task,
  onClose,
  onSave,
  onDelete,
}: TaskEditModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(defaultDraft)

  useEffect(() => {
    if (!task) {
      setDraft(defaultDraft)
      return
    }

    setDraft({
      title: task.title,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      project: task.project,
    })
  }, [task])

  useEffect(() => {
    if (!task) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, task])

  if (!task) {
    return null
  }

  const activeTask = task

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSave(activeTask, draft)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/30 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_30px_90px_rgba(17,17,17,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Edit task
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
              Keep it lightweight
            </h2>
            {task.recurrence !== 'none' ? (
              <p className="mt-2 text-sm text-stone-600">
                This task repeats <span className="font-medium">{activeTask.recurrence}</span>{' '}
                based on the original capture text.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Title</span>
            <input
              autoFocus
              value={draft.title}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-[15px] text-stone-900 outline-none focus:border-stone-900"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">
                Due date
              </span>
              <input
                type="date"
                value={draft.dueDate ?? ''}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    dueDate: event.target.value || null,
                  }))
                }
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-[15px] text-stone-900 outline-none focus:border-stone-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">Project</span>
              <input
                value={draft.project ?? ''}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    project: event.target.value,
                  }))
                }
                placeholder="platform"
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-[15px] text-stone-900 outline-none focus:border-stone-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">Status</span>
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    status: event.target.value as TaskDraft['status'],
                  }))
                }
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-[15px] text-stone-900 outline-none focus:border-stone-900"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">
                Priority
              </span>
              <select
                value={draft.priority}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    priority: event.target.value as TaskDraft['priority'],
                  }))
                }
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-[15px] text-stone-900 outline-none focus:border-stone-900"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => void onDelete(activeTask.id)}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
            >
              Delete
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
