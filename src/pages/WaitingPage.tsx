import { useEffect } from 'react'
import { EmptyState } from '../components/EmptyState'
import { TaskSection } from '../components/TaskSection'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { getWaitingTasks, matchesTaskSearch } from '../utils/taskFilters'

export function WaitingPage() {
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

  const waitingTasks = getWaitingTasks(
    tasks.filter((task) => matchesTaskSearch(task, searchQuery)),
  )

  useEffect(() => {
    registerVisibleTaskIds(waitingTasks.map((task) => task.id))
    return () => registerVisibleTaskIds([])
  }, [registerVisibleTaskIds, waitingTasks])

  if (waitingTasks.length === 0) {
    return (
      <EmptyState
        title="No waiting tasks"
        message="Use @waiting or start a capture with “Waiting for …” to send work here."
      />
    )
  }

  return (
    <TaskSection
      title="Waiting"
      description="Oldest follow-ups first."
      tasks={waitingTasks}
      emptyTitle="No waiting tasks"
      emptyMessage="This view fills only when outside dependencies appear."
      selectedTaskId={selectedTaskId}
      onSelectTask={selectTask}
      onOpen={openTask}
      onToggleComplete={onToggleComplete}
      onMoveTask={onMoveTask}
    />
  )
}
