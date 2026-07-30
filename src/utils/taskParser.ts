import type { TaskRecurrence, TaskStatus } from '../models/task'
import { addDays, getNextWeekdayDate, getTodayDateString } from './date'

const weekdayIndex: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export interface ParsedCapture {
  title: string
  dueDate: string | null
  project: string | null
  recurrence: TaskRecurrence
  status: TaskStatus
}

function cleanupTitle(title: string) {
  return title
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.!?:;])/g, '$1')
    .trim()
}

export function parseCaptureInput(
  input: string,
  referenceDate = new Date(),
): ParsedCapture {
  const original = input.trim()
  let title = ` ${original} `
  let dueDate: string | null = null
  let project: string | null = null
  let recurrence: TaskRecurrence = 'none'
  let status: TaskStatus = 'inbox'

  const projectMatch = title.match(/\B#([a-z0-9][\w-]*)/i)
  if (projectMatch) {
    project = projectMatch[1].toLowerCase()
    title = title.replace(/\B#[a-z0-9][\w-]*/gi, ' ')
  }

  if (/\B@waiting\b/i.test(title)) {
    status = 'waiting'
    title = title.replace(/\B@waiting\b/gi, ' ')
  }

  if (/\bwaiting for\b/i.test(title)) {
    status = 'waiting'
  }

  const today = getTodayDateString(referenceDate)

  const recurringWeekdayMatch = title.match(
    /\bevery\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
  )

  if (recurringWeekdayMatch) {
    recurrence = 'weekly'
    dueDate = getNextWeekdayDate(
      weekdayIndex[recurringWeekdayMatch[1].toLowerCase()],
      referenceDate,
      true,
    )
    title = title.replace(
      /\bevery\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
      ' ',
    )
  } else if (/\bevery day\b/i.test(title)) {
    recurrence = 'daily'
    dueDate = today
    title = title.replace(/\bevery day\b/i, ' ')
  } else if (/\bevery week\b/i.test(title)) {
    recurrence = 'weekly'
    dueDate = today
    title = title.replace(/\bevery week\b/i, ' ')
  } else if (/\bevery month\b/i.test(title)) {
    recurrence = 'monthly'
    dueDate = today
    title = title.replace(/\bevery month\b/i, ' ')
  }

  const nextWeekdayMatch = title.match(
    /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
  )

  if (!dueDate && nextWeekdayMatch) {
    dueDate = getNextWeekdayDate(
      weekdayIndex[nextWeekdayMatch[1].toLowerCase()],
      referenceDate,
      false,
    )
    title = title.replace(
      /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
      ' ',
    )
  } else if (!dueDate && /\btoday\b/i.test(title)) {
    dueDate = today
    status = 'today'
    title = title.replace(/\btoday\b/i, ' ')
  } else if (!dueDate && /\btomorrow\b/i.test(title)) {
    dueDate = addDays(today, 1)
    title = title.replace(/\btomorrow\b/i, ' ')
  } else if (!dueDate) {
    const weekdayMatch = title.match(
      /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
    )

    if (weekdayMatch) {
      dueDate = getNextWeekdayDate(
        weekdayIndex[weekdayMatch[1].toLowerCase()],
        referenceDate,
        true,
      )
      title = title.replace(
        /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
        ' ',
      )
    }
  }

  const cleanedTitle = cleanupTitle(title)

  return {
    title: cleanedTitle || original,
    dueDate,
    project,
    recurrence,
    status,
  }
}
