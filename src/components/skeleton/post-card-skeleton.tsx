'use client'

import { cn } from '@/lib/utils'

interface PostCardSkeletonProps {
  detailed?: boolean
  className?: string
}

export function PostCardSkeleton({
  detailed = false,
  className,
}: PostCardSkeletonProps) {
  return (
    <div
      className={cn('card-elevated rounded-2xl p-6 animate-pulse', className)}
    >
      <div className="flex gap-4">
        {/* Avatar skeleton */}
        <div
          className={`${detailed ? 'size-16' : 'size-14'} rounded-full bg-zinc-800/70`}
        ></div>

        <div className="flex-1">
          {/* User info skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-wrap gap-2">
              <div className="h-5 w-32 bg-zinc-800/70 rounded-md"></div>
              <div className="h-5 w-24 bg-zinc-800/70 rounded-md"></div>
              <div className="h-5 w-5 bg-zinc-800/70 rounded-full"></div>
              <div className="h-5 w-28 bg-zinc-800/70 rounded-md"></div>
            </div>
            <div className="h-8 w-8 bg-zinc-800/70 rounded-full"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-5 bg-zinc-800/70 rounded-md w-full"></div>
            <div className="h-5 bg-zinc-800/70 rounded-md w-5/6"></div>
            <div className="h-5 bg-zinc-800/70 rounded-md w-4/6"></div>
          </div>

          {/* Media skeleton (50% chance) */}
          {Math.random() > 0.5 && (
            <div className="mb-4">
              <div className="aspect-video w-full bg-zinc-800/70 rounded-xl"></div>
            </div>
          )}

          {/* Actions skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-zinc-800/70 rounded-full"></div>
                <div className="h-5 w-5 bg-zinc-800/70 rounded-md"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-zinc-800/70 rounded-full"></div>
                <div className="h-5 w-5 bg-zinc-800/70 rounded-md"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-zinc-800/70 rounded-full"></div>
                <div className="h-5 w-5 bg-zinc-800/70 rounded-md"></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-zinc-800/70 rounded-full"></div>
                <div className="h-5 w-5 bg-zinc-800/70 rounded-md"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-zinc-800/70 rounded-full"></div>
                <div className="h-5 w-5 bg-zinc-800/70 rounded-md"></div>
              </div>
              <div className="h-8 w-8 bg-zinc-800/70 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
