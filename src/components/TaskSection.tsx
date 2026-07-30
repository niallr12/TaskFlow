import type { Task } from '../models/task'
import { EmptyState } from './EmptyState'
import { TaskRow } from './TaskRow'

interface TaskSectionProps {
  title: string
  description: string
  tasks: Task[]
  emptyTitle: string
  emptyMessage: string
  onOpen: (taskId: string) => void
  onToggleComplete: (task: Task) => Promise<void>
  onMoveTask: (task: Task, status: Task['status']) => Promise<void>
}

export function TaskSection({
  title,
  description,
  tasks,
  emptyTitle,
  emptyMessage,
  onOpen,
  onToggleComplete,
  onMoveTask,
}: TaskSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
          {title}
        </h2>
        <p className="mt-1 text-sm text-stone-600">{description}</p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
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
