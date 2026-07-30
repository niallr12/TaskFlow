import { type ReactNode, useEffect, useRef } from 'react'
import type { Task } from '../models/task'
import {
  formatDueDate,
  getElapsedDaysSince,
  getTodayDateString,
} from '../utils/date'

interface TaskRowProps {
  task: Task
  selected: boolean
  onSelect: (taskId: string) => void
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
  selected,
  onSelect,
  onOpen,
  onToggleComplete,
  onMoveTask,
}: TaskRowProps) {
  const rowRef = useRef<HTMLElement>(null)
  const isOverdue = task.dueDate !== null && task.dueDate < getTodayDateString()
  const waitingDays = getElapsedDaysSince(task.createdAt)

  useEffect(() => {
    if (selected) {
      rowRef.current?.scrollIntoView({
        block: 'nearest',
      })
    }
  }, [selected])

  return (
    <article
      ref={rowRef}
      onMouseDown={() => onSelect(task.id)}
      className={[
        'group rounded-xl border bg-white px-3 py-2.5 transition',
        selected
          ? 'border-stone-900 shadow-[inset_0_0_0_1px_rgba(28,25,23,0.25)]'
          : 'border-stone-200 hover:border-stone-300',
      ].join(' ')}
    >
      <div className="flex flex-col gap-2 xl:flex-row xl:items-start xl:gap-3">
        <button
          type="button"
          onClick={() => {
            onSelect(task.id)
            void onToggleComplete(task)
          }}
          aria-label={`Complete ${task.title}`}
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-stone-400 text-[11px] text-stone-900 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
        >
          ✓
        </button>

        <button
          type="button"
          onClick={() => {
            onSelect(task.id)
            onOpen(task.id)
          }}
          className="flex-1 text-left"
        >
          <p className="text-[14px] font-medium leading-5 text-stone-900">{task.title}</p>

          {task.status === 'waiting' ? (
            <div className="mt-2 space-y-2 text-sm text-stone-600">
              {task.waitingOn ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                    Waiting on
                  </p>
                  <p className="mt-0.5 text-[14px] text-stone-800">{task.waitingOn}</p>
                </div>
              ) : null}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Waiting for
                </p>
                <p className="mt-0.5 text-[14px] text-stone-800">
                  {waitingDays} day{waitingDays === 1 ? '' : 's'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {task.project ? <MetaPill>#{task.project}</MetaPill> : null}
                {task.dueDate ? <MetaPill>{formatDueDate(task.dueDate)}</MetaPill> : null}
              </div>
            </div>
          ) : (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {task.dueDate ? (
                <MetaPill tone={isOverdue ? 'warning' : 'neutral'}>
                  {formatDueDate(task.dueDate)}
                </MetaPill>
              ) : null}
              {task.priority !== 'normal' ? <MetaPill>{task.priority}</MetaPill> : null}
              {task.project ? <MetaPill>#{task.project}</MetaPill> : null}
              {task.recurrence !== 'none' ? <MetaPill>{task.recurrence}</MetaPill> : null}
              {task.waitingOn ? <MetaPill>{task.waitingOn}</MetaPill> : null}
            </div>
          )}
        </button>

        <div className="flex flex-wrap gap-1.5 xl:justify-end">
          {(['today', 'inbox', 'waiting'] as const).map((status) => (
            <button
              key={status}
              type="button"
              disabled={task.status === status}
              onClick={() => {
                onSelect(task.id)
                void onMoveTask(task, status)
              }}
              className={[
                'rounded-md border px-2 py-1 text-[11px] font-medium transition',
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
