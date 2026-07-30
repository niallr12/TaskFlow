import type { Task } from '../models/task'
import { EmptyState } from './EmptyState'
import { TaskRow } from './TaskRow'

interface TaskSectionProps {
  title: string
  description?: string
  tasks: Task[]
  emptyTitle: string
  emptyMessage: string
  selectedTaskId: string | null
  onSelectTask: (taskId: string) => void
  onOpen: (taskId: string) => void
  onToggleComplete: (task: Task) => Promise<void>
  onMoveTask: (task: Task, status: Task['status']) => Promise<void>
  collapseWhenEmpty?: boolean
}

export function TaskSection({
  title,
  description,
  tasks,
  emptyTitle,
  emptyMessage,
  selectedTaskId,
  onSelectTask,
  onOpen,
  onToggleComplete,
  onMoveTask,
  collapseWhenEmpty = false,
}: TaskSectionProps) {
  if (collapseWhenEmpty && tasks.length === 0) {
    return null
  }

  return (
    <section className="space-y-2">
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.03em] text-stone-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-sm text-stone-600">{description}</p>
        ) : null}
      </div>

      {tasks.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={selectedTaskId === task.id}
              onSelect={onSelectTask}
              onOpen={onOpen}
              onToggleComplete={onToggleComplete}
              onMoveTask={onMoveTask}
            />
          ))}
        </div>
      )}
    </section>
  )
}
