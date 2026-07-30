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
  waitingOn: string | null
  recurrence: TaskRecurrence
  status: TaskStatus
}

function upperFirst(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : value
}

function normalizeWaitingOn(value: string) {
  return value
    .trim()
    .replace(/^the\s+/i, '')
    .split(/\s+/)
    .map((part) => {
      if (part.toUpperCase() === part) {
        return part
      }

      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
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
  let waitingOn: string | null = null
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

  const waitingToMatch = title.match(/\bwaiting for\s+(.+?)\s+to\s+(.+)/i)
  const waitingOnMatch = title.match(/\bwaiting for\s+(.+?)\s+on\s+(.+)/i)
  const bareWaitingMatch = title.match(/^\s*waiting for\s+(.+?)\s*$/i)

  if (waitingToMatch) {
    status = 'waiting'
    waitingOn = normalizeWaitingOn(waitingToMatch[1])
    title = ` ${upperFirst(waitingToMatch[2].trim())} `
  } else if (waitingOnMatch) {
    status = 'waiting'
    waitingOn = normalizeWaitingOn(waitingOnMatch[1])
    title = ` ${upperFirst(waitingOnMatch[2].trim())} `
  } else if (bareWaitingMatch) {
    status = 'waiting'
    waitingOn = normalizeWaitingOn(bareWaitingMatch[1])
  } else if (/\bwaiting for\b/i.test(title)) {
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
    waitingOn,
    recurrence,
    status,
  }
}
