'use client'

import { cn } from '@/lib/utils'

interface CommentCardSkeletonProps {
  className?: string
  compact?: boolean
}

export function CommentCardSkeleton({
  className,
  compact = false,
}: CommentCardSkeletonProps) {
  return (
    <div
      className={cn('card-elevated rounded-2xl p-4 animate-pulse', className)}
    >
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <div
          className={`${compact ? 'size-8' : 'size-10'} rounded-full bg-zinc-800/70 flex-shrink-0`}
        ></div>

        <div className="flex-1 min-w-0">
          {/* User info skeleton */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap gap-2 min-w-0">
              <div className="h-4 w-20 bg-zinc-800/70 rounded-md"></div>
              <div className="h-4 w-16 bg-zinc-800/70 rounded-md"></div>
              <div className="h-4 w-4 bg-zinc-800/70 rounded-full"></div>
              <div className="h-4 w-18 bg-zinc-800/70 rounded-md"></div>
              <div className="h-4 w-4 bg-zinc-800/70 rounded-full"></div>
              <div className="h-4 w-12 bg-zinc-800/70 rounded-md"></div>
            </div>
            <div className="h-6 w-6 bg-zinc-800/70 rounded-full flex-shrink-0"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-zinc-800/70 rounded-md w-full"></div>
            <div className="h-4 bg-zinc-800/70 rounded-md w-4/5"></div>
            {!compact && (
              <div className="h-4 bg-zinc-800/70 rounded-md w-3/5"></div>
            )}
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 bg-zinc-800/70 rounded-full"></div>
                <div className="h-4 w-4 bg-zinc-800/70 rounded-md"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 bg-zinc-800/70 rounded-full"></div>
                <div className="h-4 w-4 bg-zinc-800/70 rounded-md"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 bg-zinc-800/70 rounded-full"></div>
                <div className="h-4 w-4 bg-zinc-800/70 rounded-md"></div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="h-6 w-6 bg-zinc-800/70 rounded-full"></div>
              <div className="h-4 w-4 bg-zinc-800/70 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
