import { useOutletContext } from 'react-router-dom'
import type { CompletionRecord, Task } from '../models/task'

export interface AppShellContextValue {
  tasks: Task[]
  completionRecords: CompletionRecord[]
  searchQuery: string
  openTask: (taskId: string) => void
  onToggleComplete: (task: Task) => Promise<void>
  onMoveTask: (task: Task, status: Task['status']) => Promise<void>
}

export function useAppShellContext() {
  return useOutletContext<AppShellContextValue>()
}
