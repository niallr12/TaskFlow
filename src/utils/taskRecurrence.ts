import type { TaskRecurrence } from '../models/task'
import { addDays, addMonths, getTodayDateString } from './date'

function advanceDate(dateString: string, recurrence: TaskRecurrence) {
  switch (recurrence) {
    case 'daily':
      return addDays(dateString, 1)
    case 'weekly':
      return addDays(dateString, 7)
    case 'monthly':
      return addMonths(dateString, 1)
    default:
      return dateString
  }
}

export function getNextRecurringDueDate(
  dueDate: string | null,
  recurrence: TaskRecurrence,
  referenceDate = new Date(),
) {
  const completedOn = getTodayDateString(referenceDate)
  let nextDue = dueDate ?? completedOn

  do {
    nextDue = advanceDate(nextDue, recurrence)
  } while (nextDue <= completedOn)

  return nextDue
}
