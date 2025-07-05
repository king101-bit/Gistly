'use client'

import { cn } from '@/lib/utils'

interface UserCardSkeletonProps {
  className?: string
  compact?: boolean
}

export function UserCardSkeleton({
  className,
  compact = false,
}: UserCardSkeletonProps) {
  return (
    <div
      className={cn('card-elevated rounded-2xl p-4 animate-pulse', className)}
    >
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <div
          className={`${compact ? 'size-10' : 'size-14'} rounded-full bg-zinc-800/70`}
        ></div>

        <div className="flex-1">
          {/* User info skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 w-28 bg-zinc-800/70 rounded-md mb-1"></div>
              <div className="h-4 w-20 bg-zinc-800/70 rounded-md mb-1"></div>

              {!compact && (
                <>
                  <div className="h-4 w-24 bg-zinc-800/70 rounded-md mb-2"></div>
                  <div className="flex gap-4">
                    <div className="h-4 w-16 bg-zinc-800/70 rounded-md"></div>
                    <div className="h-4 w-16 bg-zinc-800/70 rounded-md"></div>
                  </div>
                </>
              )}
            </div>

            {/* Follow button skeleton */}
            <div
              className={`${compact ? 'h-8 w-20' : 'h-10 w-24'} bg-zinc-800/70 rounded-full`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
