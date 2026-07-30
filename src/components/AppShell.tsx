import { useState, useTransition } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Outlet } from 'react-router-dom'
import { taskflowDb } from '../services/db'
import {
  createCapturedTask,
  deleteTask,
  moveTaskToStatus,
  toggleTaskCompletion,
  updateTaskDraft,
} from '../services/taskMutations'
import {
  getInboxTasks,
  getTodayGroups,
  getWaitingTasks,
  getWeeklyCompletionRecords,
} from '../utils/taskFilters'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { AppShellContextValue } from '../hooks/useAppShellContext'
import { NavSidebar } from './NavSidebar'
import { QuickCapture } from './QuickCapture'
import { TaskEditModal } from './TaskEditModal'

export function AppShell() {
  const [searchInput, setSearchInput] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const searchQuery = useDebouncedValue(searchInput.trim().toLowerCase(), 220)

  const tasks =
    useLiveQuery(async () => {
      const records = await taskflowDb.tasks.toArray()
      return records.sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    }, []) ?? []

  const completionRecords =
    useLiveQuery(async () => {
      const records = await taskflowDb.completionRecords.toArray()
      return records.sort((left, right) =>
        right.completedAt.localeCompare(left.completedAt),
      )
    }, []) ?? []

  const selectedTask = tasks.find((task) => task.id === editingTaskId) ?? null
  const todayGroups = getTodayGroups(tasks)
  const inboxTasks = getInboxTasks(tasks)
  const waitingTasks = getWaitingTasks(tasks)
  const weeklyCompletions = getWeeklyCompletionRecords(completionRecords)

  const contextValue: AppShellContextValue = {
    tasks,
    completionRecords,
    searchQuery,
    openTask: setEditingTaskId,
    onToggleComplete: async (task) => {
      await toggleTaskCompletion(task)
    },
    onMoveTask: async (task, status) => {
      await moveTaskToStatus(task, status)
    },
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(229,217,197,0.55),_transparent_40%),linear-gradient(180deg,_#f8f5ef_0%,_#f2ede4_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-[1640px] flex-col lg:flex-row">
        <NavSidebar
          todayCount={
            todayGroups.overdue.length +
            todayGroups.dueToday.length +
            todayGroups.markedToday.length
          }
          inboxCount={inboxTasks.length}
          waitingCount={waitingTasks.length}
          completedCount={weeklyCompletions.length}
        />

        <div className="flex min-h-screen flex-1 flex-col border-l border-stone-300/70 bg-white/85 backdrop-blur-sm">
          <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/88 backdrop-blur-md">
            <div className="px-4 py-4 md:px-6 md:py-5">
              <QuickCapture
                onCreate={createCapturedTask}
                onError={() =>
                  window.alert('TaskFlow could not save that task locally.')
                }
              />

              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-stone-600">
                  Keep this open all day. Capture with one line and press Enter.
                </p>

                <label className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
                    Search
                  </span>
                  <input
                    value={searchInput}
                    onChange={(event) => {
                      const value = event.target.value
                      startTransition(() => setSearchInput(value))
                    }}
                    placeholder="Title or project"
                    className="min-w-0 flex-1 bg-transparent text-[15px] text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </label>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
            <Outlet context={contextValue} />
          </main>
        </div>
      </div>

      <TaskEditModal
        task={selectedTask}
        onClose={() => setEditingTaskId(null)}
        onDelete={async (taskId) => {
          await deleteTask(taskId)
          setEditingTaskId(null)
        }}
        onSave={async (task, draft) => {
          await updateTaskDraft(task, draft)
          setEditingTaskId(null)
        }}
      />
    </div>
  )
}
