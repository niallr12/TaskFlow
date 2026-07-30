import { EmptyState } from '../components/EmptyState'
import { TaskSection } from '../components/TaskSection'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { getWaitingTasks, matchesTaskSearch } from '../utils/taskFilters'

export function WaitingPage() {
  const { tasks, searchQuery, openTask, onToggleComplete, onMoveTask } =
    useAppShellContext()

  const waitingTasks = getWaitingTasks(
    tasks.filter((task) => matchesTaskSearch(task, searchQuery)),
  )

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
      description="Commitments that depend on someone else."
      tasks={waitingTasks}
      emptyTitle="No waiting tasks"
      emptyMessage="This view fills only when outside dependencies appear."
      onOpen={openTask}
      onToggleComplete={onToggleComplete}
      onMoveTask={onMoveTask}
    />
  )
}
