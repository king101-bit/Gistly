import { useUser } from '../../context/UserContext'
import { Button } from './ui/button'
import UserAvatar from './UserAvatar'

type Props = {
  user: {
    id: string
    avatar_url?: string | null
    display_name: string
    username: string
  }
  isFollowing: boolean
  onFollowToggle: (userId: string, isFollowing: boolean) => void
}

export default function UserCard({ user, isFollowing, onFollowToggle }: Props) {
  const currentUser = useUser()

  const isSelf = user.id === currentUser?.id

  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-3">
        <UserAvatar />
        <div>
          <p className="font-semibold">{user.display_name}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>

      {!isSelf && (
        <Button
          variant={isFollowing ? 'outline' : 'default'}
          onClick={() => onFollowToggle(user.id, isFollowing)}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </div>
  )
}
