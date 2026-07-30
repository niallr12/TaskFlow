import { EmptyState } from '../components/EmptyState'
import { TaskSection } from '../components/TaskSection'
import { useAppShellContext } from '../hooks/useAppShellContext'
import { getRecurringTasks, matchesTaskSearch } from '../utils/taskFilters'

export function RecurringPage() {
  const { tasks, searchQuery, openTask, onToggleComplete, onMoveTask } =
    useAppShellContext()

  const recurringTasks = getRecurringTasks(
    tasks.filter((task) => matchesTaskSearch(task, searchQuery)),
  )

  if (recurringTasks.length === 0) {
    return (
      <EmptyState
        title="No recurring tasks yet"
        message="Capture tasks with phrases like “every Friday”, “every week”, or “every day” and they will show up here."
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-stone-200 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(40,30,12,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Recurring
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Keep weekly rhythms visible
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          This is where repeating work lives, including tasks captured with text
          like “every Friday”. The due date shown is the next run.
        </p>
      </section>

      <TaskSection
        title="All recurring tasks"
        description="Daily, weekly, and monthly tasks sorted by what is due first."
        tasks={recurringTasks}
        emptyTitle="No recurring tasks yet"
        emptyMessage="Create one from the capture box and it will appear here immediately."
        onOpen={openTask}
        onToggleComplete={onToggleComplete}
        onMoveTask={onMoveTask}
      />
    </div>
  )
}
