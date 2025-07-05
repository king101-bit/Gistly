'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, UserMinus } from 'lucide-react'
import { UserProfile } from '../../../../../global'
import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { useUser } from '../../../../../context/UserContext'
import { getFollowing } from '@/lib/follow'

export default function Followers() {
  const { username } = useParams()
  const [following, setFollowing] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const user = useUser()

  useEffect(() => {
    if (!username) return
    const loadData = async () => {
      const res = await getFollowing(username as string)
      setFollowing(res)
      setLoading(false)
    }
    loadData()
  }, [username])

  const handleUnfollow = async (targetId: string) => {
    if (!user) return
    await unfollowUser(user.id, targetId)
    setFollowing((prev) => prev.filter((u) => u.id !== targetId))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />
      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8 max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/profile/${user?.username}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Following</h1>
            <p className="text-sm text-muted-foreground">
              {following.length} following
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : following.length === 0 ? (
          <p>No following yet.</p>
        ) : (
          <div className="space-y-4">
            {following.map((u) => (
              <div key={u.id} className="p-4 rounded-lg bg-zinc-800/30">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={u.avatar_url || '/placeholder.svg'} />
                    <AvatarFallback>
                      {u.display_name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link href={`/profile/${u.username}`}>
                      <h3 className="text-lg font-bold">{u.display_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        @{u.username}
                      </p>
                    </Link>
                    {u.bio && (
                      <p className="text-sm mt-1 line-clamp-2">{u.bio}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleUnfollow(u.id)}
                    className="bg-zinc-700 hover:bg-red-600 text-white rounded-full px-4 py-1"
                  >
                    <UserMinus className="size-4 mr-1" /> Unfollow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomTabBar activeTab="profile" />
    </div>
  )
}
