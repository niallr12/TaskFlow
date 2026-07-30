import { useEffect, useRef, useState, useTransition } from 'react'
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
  getRecurringTasks,
  getTodayGroups,
  getWaitingTasks,
  getWeeklyCompletionRecords,
} from '../utils/taskFilters'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { AppShellContextValue } from '../hooks/useAppShellContext'
import { NavSidebar } from './NavSidebar'
import { QuickCapture, type QuickCaptureHandle } from './QuickCapture'
import { TaskEditModal } from './TaskEditModal'

function isEditableElement(element: EventTarget | null) {
  if (!(element instanceof HTMLElement)) {
    return false
  }

  const tagName = element.tagName
  return (
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    element.isContentEditable
  )
}

export function AppShell() {
  const [searchInput, setSearchInput] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [visibleTaskIds, setVisibleTaskIds] = useState<string[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const captureRef = useRef<QuickCaptureHandle>(null)
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

  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null
  const todayGroups = getTodayGroups(tasks)
  const inboxTasks = getInboxTasks(tasks)
  const waitingTasks = getWaitingTasks(tasks)
  const recurringTasks = getRecurringTasks(tasks)
  const weeklyCompletions = getWeeklyCompletionRecords(completionRecords)
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null

  useEffect(() => {
    if (visibleTaskIds.length === 0) {
      setSelectedTaskId(null)
      return
    }

    if (!selectedTaskId || !visibleTaskIds.includes(selectedTaskId)) {
      setSelectedTaskId(visibleTaskIds[0])
    }
  }, [selectedTaskId, visibleTaskIds])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (editingTaskId) {
        return
      }

      const isTyping = isEditableElement(event.target)

      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
        return
      }

      if (
        event.key.toLowerCase() === 'n' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTyping
      ) {
        event.preventDefault()
        captureRef.current?.focus()
        return
      }

      if (event.key === 'Escape') {
        if (captureRef.current?.hasText()) {
          event.preventDefault()
          captureRef.current.clear()
          captureRef.current.focus()
          return
        }

        if (document.activeElement === searchInputRef.current && searchInput) {
          event.preventDefault()
          setSearchInput('')
        }

        return
      }

      if (isTyping || visibleTaskIds.length === 0) {
        return
      }

      const selectedIndex =
        selectedTaskId === null ? -1 : visibleTaskIds.indexOf(selectedTaskId)

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex =
          selectedIndex < visibleTaskIds.length - 1 ? selectedIndex + 1 : selectedIndex
        setSelectedTaskId(visibleTaskIds[Math.max(0, nextIndex)])
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const nextIndex = selectedIndex > 0 ? selectedIndex - 1 : 0
        setSelectedTaskId(visibleTaskIds[nextIndex])
        return
      }

      if (event.key === 'Enter' && selectedTask) {
        event.preventDefault()
        setEditingTaskId(selectedTask.id)
        return
      }

      if ((event.key === ' ' || event.code === 'Space') && selectedTask) {
        event.preventDefault()
        void toggleTaskCompletion(selectedTask)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingTaskId, searchInput, selectedTask, selectedTaskId, visibleTaskIds])

  const contextValue: AppShellContextValue = {
    tasks,
    completionRecords,
    searchQuery,
    selectedTaskId,
    openTask: setEditingTaskId,
    selectTask: setSelectedTaskId,
    registerVisibleTaskIds: setVisibleTaskIds,
    onToggleComplete: async (task) => {
      await toggleTaskCompletion(task)
    },
    onMoveTask: async (task, status) => {
      await moveTaskToStatus(task, status)
    },
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-stone-300 bg-stone-100 lg:w-[320px] lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-4 px-3 py-3 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                TaskFlow
              </p>
              <h1 className="mt-1 text-[1.6rem] font-semibold tracking-[-0.04em] text-stone-950">
                Work dashboard
              </h1>
            </div>

            <QuickCapture
              ref={captureRef}
              onCreate={createCapturedTask}
              onError={() =>
                window.alert('TaskFlow could not save that task locally.')
              }
            />

            <NavSidebar
              todayCount={
                todayGroups.overdue.length +
                todayGroups.today.length +
                todayGroups.waiting.length +
                todayGroups.upcoming.length
              }
              inboxCount={inboxTasks.length}
              waitingCount={waitingTasks.length}
              recurringCount={recurringTasks.length}
              completedCount={weeklyCompletions.length}
            />

            <div className="rounded-xl border border-stone-300 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Search
                </p>
                <span className="text-[11px] text-stone-400">/</span>
              </div>
              <input
                ref={searchInputRef}
                value={searchInput}
                onChange={(event) => {
                  const value = event.target.value
                  startTransition(() => setSearchInput(value))
                }}
                placeholder="Title or project"
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-[14px] text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-900"
              />
              <p className="mt-2 text-[12px] leading-5 text-stone-500">
                Arrow keys navigate. Enter opens. Space completes.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col bg-white">
          <main className="flex-1 px-3 py-3 md:px-4 md:py-4">
            <Outlet context={contextValue} />
          </main>
        </div>
      </div>

      <TaskEditModal
        task={editingTask}
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
