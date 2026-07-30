import { useEffect } from 'react'
import { EmptyState } from '../components/EmptyState'
import { TaskSection } from '../components/TaskSection'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { getRecurringTasks, matchesTaskSearch } from '../utils/taskFilters'

export function RecurringPage() {
  const {
    tasks,
    searchQuery,
    selectedTaskId,
    selectTask,
    registerVisibleTaskIds,
    openTask,
    onToggleComplete,
    onMoveTask,
  } =
    useAppShellContext()

  const recurringTasks = getRecurringTasks(
    tasks.filter((task) => matchesTaskSearch(task, searchQuery)),
  )

  useEffect(() => {
    registerVisibleTaskIds(recurringTasks.map((task) => task.id))
    return () => registerVisibleTaskIds([])
  }, [recurringTasks, registerVisibleTaskIds])

  if (recurringTasks.length === 0) {
    return (
      <EmptyState
        title="No recurring tasks yet"
        message="Capture tasks with phrases like “every Friday”, “every week”, or “every day” and they will show up here."
      />
    )
  }

  return (
    <TaskSection
      title="Recurring"
      description="Repeating work, including tasks captured with phrases like “every Friday”."
      tasks={recurringTasks}
      emptyTitle="No recurring tasks yet"
      emptyMessage="Create one from the capture box and it will appear here immediately."
      selectedTaskId={selectedTaskId}
      onSelectTask={selectTask}
      onOpen={openTask}
      onToggleComplete={onToggleComplete}
      onMoveTask={onMoveTask}
    />
  )
}
