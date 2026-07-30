const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const shortDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function createLocalDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
}

export function parseDateInput(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

export function toDateInputValue(date: Date) {
  const local = createLocalDate(date)
  const year = local.getFullYear()
  const month = `${local.getMonth() + 1}`.padStart(2, '0')
  const day = `${local.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayDateString(referenceDate = new Date()) {
  return toDateInputValue(referenceDate)
}

export function addDays(dateString: string, days: number) {
  const nextDate = parseDateInput(dateString)
  nextDate.setDate(nextDate.getDate() + days)
  return toDateInputValue(nextDate)
}

export function addMonths(dateString: string, months: number) {
  const nextDate = parseDateInput(dateString)
  nextDate.setMonth(nextDate.getMonth() + months)
  return toDateInputValue(nextDate)
}

export function formatDueDate(dateString: string, referenceDate = new Date()) {
  const today = getTodayDateString(referenceDate)
  const tomorrow = addDays(today, 1)

  if (dateString === today) {
    return 'Today'
  }

  if (dateString === tomorrow) {
    return 'Tomorrow'
  }

  return shortDateFormatter.format(parseDateInput(dateString))
}

export function formatCompletedAt(completedAt: string) {
  return shortDateTimeFormatter.format(new Date(completedAt))
}

export function isCurrentWeek(dateTime: string, referenceDate = new Date()) {
  const date = new Date(dateTime)
  const start = startOfWeek(referenceDate)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return date >= start && date <= end
}

export function startOfWeek(referenceDate = new Date()) {
  const date = createLocalDate(referenceDate)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function getNextWeekdayDate(
  weekday: number,
  referenceDate = new Date(),
  includeToday = true,
) {
  const date = createLocalDate(referenceDate)
  const currentWeekday = date.getDay()
  let delta = (weekday - currentWeekday + 7) % 7

  if (!includeToday && delta === 0) {
    delta = 7
  }

  date.setDate(date.getDate() + delta)
  return toDateInputValue(date)
}

export function compareDateOnly(left: string | null, right: string | null) {
  if (left === right) {
    return 0
  }

  if (!left) {
    return 1
  }

  if (!right) {
    return -1
  }

  return left.localeCompare(right)
}
