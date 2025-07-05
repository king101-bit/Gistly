export function formatShortRelativeTime(dateInput: string | Date) {
  if (typeof window === 'undefined') return ''

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000)

  if (secondsAgo < 60) return 'now'
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m`
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h`
  if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 86400)}d`
  if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2592000)}mo`

  return `${Math.floor(secondsAgo / 31536000)}y`
}
