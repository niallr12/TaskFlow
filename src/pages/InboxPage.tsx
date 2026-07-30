import { EmptyState } from '../components/EmptyState'
import { TaskSection } from '../components/TaskSection'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { getInboxTasks, matchesTaskSearch } from '../utils/taskFilters'

export function InboxPage() {
  const { tasks, searchQuery, openTask, onToggleComplete, onMoveTask } =
    useAppShellContext()

  const inboxTasks = getInboxTasks(
    tasks.filter((task) => matchesTaskSearch(task, searchQuery)),
  )

  if (inboxTasks.length === 0) {
    return (
      <EmptyState
        title="Inbox is clear"
        message="New tasks land here unless capture text makes them Today or Waiting."
      />
    )
  }

  return (
    <TaskSection
      title="Inbox"
      description="Everything not yet organised."
      tasks={inboxTasks}
      emptyTitle="Inbox is clear"
      emptyMessage="You have already sorted what matters."
      onOpen={openTask}
      onToggleComplete={onToggleComplete}
      onMoveTask={onMoveTask}
    />
  )
}
