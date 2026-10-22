// Day-level helpers for history lists (Activity, Notifications).

const startOfDay = (ts: number) => {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** "Today", "Yesterday", "Oct 18" (adds the year if it isn't this year) */
export function dayLabel(ts: number, now = Date.now()) {
  const days = Math.round((startOfDay(now) - startOfDay(ts)) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  const date = new Date(ts)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== new Date(now).getFullYear() && { year: 'numeric' }),
  })
}

/** Splits a newest-first list into [{ label: 'Today', items }, { label: 'Yesterday', items }, …] */
export function groupByDay<T>(items: T[], getTime: (item: T) => number, now = Date.now()) {
  const groups: { label: string; items: T[] }[] = []
  for (const item of items) {
    const label = dayLabel(getTime(item), now)
    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}

/** "Oct 22, 2026 at 10:42 AM" */
export function formatDateTime(ts: number) {
  const d = new Date(ts)
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}
