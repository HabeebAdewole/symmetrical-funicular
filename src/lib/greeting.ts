/** "Good morning" before noon, "Good afternoon" until 6pm, then "Good evening" (user's local time). */
export function timeOfDayGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** "Habeeb Adewole" → "HA", "kova" → "K", "" → "" */
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}
