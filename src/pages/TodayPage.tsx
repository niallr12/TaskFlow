import { useEffect } from 'react'
import { TaskSection } from '../components/TaskSection'
import { EmptyState } from '../components/EmptyState'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { getTodayGroups, matchesTaskSearch } from '../utils/taskFilters'

export function TodayPage() {
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

  const matchingTasks = tasks.filter((task) => matchesTaskSearch(task, searchQuery))
  const groups = getTodayGroups(matchingTasks)
  const totalTasks =
    groups.overdue.length +
    groups.today.length +
    groups.waiting.length +
    groups.upcoming.length

  useEffect(() => {
    registerVisibleTaskIds([
      ...groups.overdue.map((task) => task.id),
      ...groups.today.map((task) => task.id),
      ...groups.waiting.map((task) => task.id),
      ...groups.upcoming.map((task) => task.id),
    ])

    return () => registerVisibleTaskIds([])
  }, [groups.overdue, groups.today, groups.upcoming, groups.waiting, registerVisibleTaskIds])

  return (
    <div className="space-y-4">
      {totalTasks === 0 ? (
        <EmptyState
          title="Nothing demanding attention."
          message="Use the capture box above to add work in under three seconds."
        />
      ) : (
        <div className="space-y-4">
          <TaskSection
            title="Overdue"
            description="Needs attention first."
            tasks={groups.overdue}
            emptyTitle="No overdue tasks"
            emptyMessage="That is the best state for this section."
            selectedTaskId={selectedTaskId}
            onSelectTask={selectTask}
            onOpen={openTask}
            onToggleComplete={onToggleComplete}
            onMoveTask={onMoveTask}
            collapseWhenEmpty
          />

          <TaskSection
            title="Today"
            description="Due today and explicitly marked Today."
            tasks={groups.today}
            emptyTitle="Nothing due today"
            emptyMessage="You can use Today for work you still want front and centre."
            selectedTaskId={selectedTaskId}
            onSelectTask={selectTask}
            onOpen={openTask}
            onToggleComplete={onToggleComplete}
            onMoveTask={onMoveTask}
            collapseWhenEmpty
          />

          <TaskSection
            title="Waiting"
            description="Dependencies that may need follow-up."
            tasks={groups.waiting}
            emptyTitle="No waiting tasks"
            emptyMessage="This view fills only when work depends on someone else."
            selectedTaskId={selectedTaskId}
            onSelectTask={selectTask}
            onOpen={openTask}
            onToggleComplete={onToggleComplete}
            onMoveTask={onMoveTask}
            collapseWhenEmpty
          />

          <TaskSection
            title="Upcoming"
            description="Everything active that is not due today yet."
            tasks={groups.upcoming}
            emptyTitle="Nothing upcoming"
            emptyMessage="Only what matters now is left."
            selectedTaskId={selectedTaskId}
            onSelectTask={selectTask}
            onOpen={openTask}
            onToggleComplete={onToggleComplete}
            onMoveTask={onMoveTask}
            collapseWhenEmpty
          />
        </div>
      )}
    </div>
  )
}
