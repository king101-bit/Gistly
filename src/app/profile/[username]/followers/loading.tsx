import { UserCardSkeleton } from '@/components/skeleton/UserCardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <div className="h-8 w-48 bg-zinc-800/70 rounded-md animate-pulse"></div>
      </div>

      {/* Search skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="h-12 bg-zinc-800/70 rounded-xl w-full"></div>
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-pulse">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-zinc-800/70 rounded-full flex-shrink-0"
            ></div>
          ))}
      </div>

      <div className="space-y-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
      </div>
    </div>
  )
}
