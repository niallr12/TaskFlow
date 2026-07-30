import { TaskSection } from '../components/TaskSection'
import { EmptyState } from '../components/EmptyState'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { getTodayGroups, matchesTaskSearch } from '../utils/taskFilters'

export function TodayPage() {
  const { tasks, searchQuery, openTask, onToggleComplete, onMoveTask } =
    useAppShellContext()

  const matchingTasks = tasks.filter((task) => matchesTaskSearch(task, searchQuery))
  const groups = getTodayGroups(matchingTasks)
  const totalTasks =
    groups.overdue.length + groups.dueToday.length + groups.markedToday.length

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-stone-200 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(40,30,12,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Today
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Focus without clutter
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          Overdue work, due-today tasks, and anything you explicitly marked for
          Today stay in one place.
        </p>
      </section>

      {totalTasks === 0 ? (
        <EmptyState
          title="Nothing demanding attention."
          message="Use the capture box above to add work in under three seconds."
        />
      ) : (
        <div className="space-y-6">
          <TaskSection
            title="Overdue"
            description="Tasks that should already be moving."
            tasks={groups.overdue}
            emptyTitle="No overdue tasks"
            emptyMessage="That is the best state for this section."
            onOpen={openTask}
            onToggleComplete={onToggleComplete}
            onMoveTask={onMoveTask}
          />

          <TaskSection
            title="Due today"
            description="Deadlines that land today."
            tasks={groups.dueToday}
            emptyTitle="Nothing due today"
            emptyMessage="You can use Today for work you still want front and centre."
            onOpen={openTask}
            onToggleComplete={onToggleComplete}
            onMoveTask={onMoveTask}
          />

          <TaskSection
            title="Marked Today"
            description="Tasks you deliberately pulled into today."
            tasks={groups.markedToday}
            emptyTitle="Nothing marked Today"
            emptyMessage="Use the Today action on any task to bring it here."
            onOpen={openTask}
            onToggleComplete={onToggleComplete}
            onMoveTask={onMoveTask}
          />
        </div>
      )}
    </div>
  )
}
