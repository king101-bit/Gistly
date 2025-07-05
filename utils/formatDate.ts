// utils/formatDate.ts
import { formatDistanceToNow } from 'date-fns'

export function formatShortRelativeTime(isoDate: string | Date) {
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate
  const relativeTime = formatDistanceToNow(date, { addSuffix: true })

  // Custom formatting for shorter output
  return relativeTime
    .replace('less than a minute ago', 'now')
    .replace(' minute ago', 'm')
    .replace(' minutes ago', 'm')
    .replace(' hour ago', 'h')
    .replace(' hours ago', 'h')
    .replace(' day ago', 'd')
    .replace(' days ago', 'd')
    .replace(' month ago', 'mo')
    .replace(' months ago', 'mo')
    .replace(' year ago', 'y')
    .replace(' years ago', 'y')
    .replace('about ', '')
    .replace('over ', '')
}
