import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { formatCompletedAt } from '../utils/date'
import {
  getWeeklyCompletionRecords,
  matchesCompletionSearch,
} from '../utils/taskFilters'

export function CompletedWeekPage() {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')
  const { completionRecords, searchQuery, tasks, openTask, registerVisibleTaskIds } =
    useAppShellContext()

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

  const summaryText = useMemo(() => {
    return [
      'Completed This Week',
      '',
      ...groupedRecords.flatMap(([project, records]) => [
        project,
        ...records.map((record) => `- ${record.title}`),
        '',
      ]),
    ]
      .join('\n')
      .trim()
  }, [groupedRecords])

  useEffect(() => {
    registerVisibleTaskIds([])
    return () => registerVisibleTaskIds([])
  }, [registerVisibleTaskIds])

  async function handleCopySummary() {
    await navigator.clipboard.writeText(summaryText)
    setCopyState('copied')
    window.setTimeout(() => setCopyState('idle'), 1500)
  }

  if (weeklyRecords.length === 0) {
    return (
      <EmptyState
        title="Nothing completed this week"
        message="Completed work appears here the moment you tick it off."
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-stone-950">
            Completed This Week
          </h2>
          <p className="text-sm text-stone-600">
            Completion date, project, and task title.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleCopySummary()}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-900"
        >
          {copyState === 'copied' ? 'Copied' : 'Copy Summary'}
        </button>
      </div>

      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="grid grid-cols-[160px_120px_minmax(0,1fr)] gap-3 border-b border-stone-200 bg-stone-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          <span>Date</span>
          <span>Project</span>
          <span>Task</span>
        </div>

        <div className="divide-y divide-stone-200">
          {weeklyRecords.map((record) => {
            const linkedTask = tasks.find((task) => task.id === record.taskId) ?? null

            return (
              <button
                key={record.id}
                type="button"
                onClick={() => linkedTask && openTask(linkedTask.id)}
                disabled={!linkedTask}
                className="grid w-full grid-cols-[160px_120px_minmax(0,1fr)] gap-3 px-3 py-2.5 text-left transition hover:bg-stone-50 disabled:cursor-default disabled:hover:bg-white"
              >
                <span className="text-sm text-stone-600">
                  {formatCompletedAt(record.completedAt)}
                </span>
                <span className="text-sm text-stone-600">
                  {record.project ?? 'Other'}
                </span>
                <span className="text-[14px] font-medium text-stone-900">
                  {record.title}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
