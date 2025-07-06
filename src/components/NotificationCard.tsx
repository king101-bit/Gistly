'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, UserPlus, AtSign, Repeat2 } from 'lucide-react'
import { NotificationCardProps } from '../../global'
import { formatDistanceToNow } from 'date-fns'

export function NotificationCard({ notification }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="size-6 text-red-400" />
      case 'reply':
        return <MessageCircle className="size-6 text-blue-400" />
      case 'follow':
        return <UserPlus className="size-6 text-emerald-400" />
      case 'mention':
        return <AtSign className="size-6 text-yellow-400" />
      case 'repost':
        return <Repeat2 className="size-6 text-green-400" />
    }
  }

  const getActionText = () => {
    switch (notification.type) {
      case 'like':
        return 'liked'
      case 'reply':
        return 'replied to'
      case 'follow':
        return 'started following'
      case 'mention':
        return 'mentioned'
      case 'repost':
        return 'reposted'
    }
  }

  return (
    <div
      className={`w-full card-elevated rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer hover:scale-[1.02] mb-4 ${
        notification.unread ? 'ring-2 ring-emerald-500/30 glow-effect' : ''
      }`}
    >
      <div className="flex flex-wrap sm:flex-nowrap gap-4 items-start">
        {/* Icon */}
        <div className="flex-shrink-0 p-2">{getIcon()}</div>

        {/* Avatar */}
        <Avatar className="size-10 sm:size-12 ring-2 ring-emerald-500/20">
          <AvatarImage src={notification.user.avatar || '/placeholder.svg'} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
            {notification.user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
            <span className="font-bold text-foreground truncate max-w-[50%]">
              {notification.user.name}
            </span>
            <span className="text-muted-foreground">
              @{notification.user.username}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(notification.timestamp), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-zinc-300 leading-relaxed break-words">
            <span className="text-emerald-400 font-medium">
              {getActionText()}
            </span>{' '}
            {notification.content}
          </p>
        </div>

        {/* Unread dot */}
        {notification.unread && (
          <div className="size-3 bg-emerald-400 rounded-full flex-shrink-0 mt-2 pulse-glow" />
        )}
      </div>
    </div>
  )
}
