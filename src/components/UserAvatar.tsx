'use client'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUser } from '../../context/UserContext'

type UserAvatarProps = {
  className?: string
  user?: {
    avatar_url?: string | null
    display_name?: string | null
  }
}

export default function UserAvatar({
  className,
  user: propUser,
}: UserAvatarProps) {
  const currentUser = useUser()
  const user = propUser || currentUser

  if (!user) return null

  return (
    <Avatar
      className={
        className ??
        'size-10 ring-2 ring-emerald-500/20 button-press cursor-pointer'
      }
    >
      <AvatarImage
        src={user.avatar_url || '/placeholder.svg?height=40&width=40'}
        alt={user.display_name || 'User avatar'}
      />
      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
        {user.display_name
          ?.split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
  )
}
