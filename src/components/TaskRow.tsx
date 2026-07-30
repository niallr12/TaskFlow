import type { ReactNode } from 'react'
import type { Task } from '../models/task'
import { formatDueDate, getTodayDateString } from '../utils/date'

interface TaskRowProps {
  task: Task
  onOpen: (taskId: string) => void
  onToggleComplete: (task: Task) => Promise<void>
  onMoveTask: (task: Task, status: Task['status']) => Promise<void>
}

function MetaPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'warning'
}) {
  return (
    <span
      className={[
        'rounded-full px-2.5 py-1 text-xs font-medium',
        tone === 'warning'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-stone-100 text-stone-600',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

export function TaskRow({
  task,
  onOpen,
  onToggleComplete,
  onMoveTask,
}: TaskRowProps) {
  const isOverdue = task.dueDate !== null && task.dueDate < getTodayDateString()

  return (
    <article className="group rounded-[22px] border border-stone-200 bg-white p-3 shadow-[0_10px_24px_rgba(24,20,16,0.04)] transition hover:border-stone-300">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:gap-4">
        <button
          type="button"
          onClick={() => void onToggleComplete(task)}
          aria-label={`Complete ${task.title}`}
          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-stone-400 text-sm text-stone-900 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
        >
          ✓
        </button>

        <button
          type="button"
          onClick={() => onOpen(task.id)}
          className="flex-1 text-left"
        >
          <p className="text-[15px] font-medium leading-6 text-stone-900">
            {task.title}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {task.dueDate ? (
              <MetaPill tone={isOverdue ? 'warning' : 'neutral'}>
                {formatDueDate(task.dueDate)}
              </MetaPill>
            ) : null}
            {task.priority !== 'normal' ? (
              <MetaPill>{task.priority}</MetaPill>
            ) : null}
            {task.project ? <MetaPill>#{task.project}</MetaPill> : null}
            {task.recurrence !== 'none' ? (
              <MetaPill>{task.recurrence}</MetaPill>
            ) : null}
          </div>
        </button>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          {(['today', 'inbox', 'waiting'] as const).map((status) => (
            <button
              key={status}
              type="button"
              disabled={task.status === status}
              onClick={() => void onMoveTask(task, status)}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                task.status === status
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-white',
              ].join(' ')}
            >
              {status === 'today'
                ? 'Today'
                : status === 'inbox'
                  ? 'Inbox'
                  : 'Waiting'}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}
