import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import {
  followHashtag,
  isFollowingHashtag,
  unfollowHashtag,
} from '../utils/HashtagFollowers'

export function useHashtagFollow(hashtag: string) {
  const { id: userId } = useUser() || {}
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    isFollowingHashtag(userId, hashtag).then((follows) => {
      setIsFollowing(follows)
      setLoading(false)
    })
  }, [userId, hashtag])

  const toggleFollow = async () => {
    if (!userId) return

    setLoading(true)
    const success = isFollowing
      ? await unfollowHashtag(userId, hashtag)
      : await followHashtag(userId, hashtag)

    if (success) setIsFollowing(!isFollowing)
    setLoading(false)
  }

  return { isFollowing, loading, toggleFollow }
}
