import { useMemo } from 'react'
import { EmptyState } from '../components/EmptyState'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { formatCompletedAt } from '../utils/date'
import {
  getWeeklyCompletionRecords,
  matchesCompletionSearch,
} from '../utils/taskFilters'

export function CompletedWeekPage() {
  const { completionRecords, searchQuery, tasks, openTask } = useAppShellContext()

  const weeklyRecords = getWeeklyCompletionRecords(
    completionRecords.filter((record) => matchesCompletionSearch(record, searchQuery)),
  )

  const groupedRecords = useMemo(() => {
    return Object.entries(
      weeklyRecords.reduce<Record<string, typeof weeklyRecords>>((groups, record) => {
        const key = record.project ?? 'Other'
        groups[key] ??= []
        groups[key].push(record)
        return groups
      }, {}),
    ).sort(([left], [right]) => left.localeCompare(right))
  }, [weeklyRecords])

  if (weeklyRecords.length === 0) {
    return (
      <EmptyState
        title="Nothing completed this week"
        message="Completed work appears here the moment you tick it off."
      />
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-stone-200 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(40,30,12,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Completed this week
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Keep momentum visible
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Every completion is recorded locally, including recurring tasks that roll
          forward automatically.
        </p>
      </section>

      {groupedRecords.map(([project, records]) => (
        <section
          key={project}
          className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,24,18,0.04)]"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
              {project}
            </h3>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              {records.length}
            </span>
          </div>

          <div className="space-y-3">
            {records.map((record) => {
              const linkedTask = tasks.find((task) => task.id === record.taskId) ?? null

              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => linkedTask && openTask(linkedTask.id)}
                  disabled={!linkedTask}
                  className="flex w-full items-start justify-between gap-4 rounded-[20px] border border-stone-200 bg-stone-50 px-4 py-3 text-left transition hover:border-stone-300 hover:bg-white disabled:cursor-default disabled:hover:border-stone-200 disabled:hover:bg-stone-50"
                >
                  <div>
                    <p className="text-[15px] font-medium leading-6 text-stone-900">
                      {record.title}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {linkedTask?.recurrence !== 'none' ? 'Recurring task' : 'Task'}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-500">
                    {formatCompletedAt(record.completedAt)}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
