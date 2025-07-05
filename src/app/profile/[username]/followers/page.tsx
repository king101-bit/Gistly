'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, UserMinus, UserPlus } from 'lucide-react'
import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { useUser } from '../../../../../context/UserContext'
import { createClient } from '../../../../../utils/supabase/client'
import { UserProfile } from '../../../../../global'

export default function FollowersPage() {
  const { username } = useParams()
  const currentUser = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [followers, setFollowers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [youFollowIds, setYouFollowIds] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!username) return

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (!userProfile?.id) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('followers')
        .select(
          `
          created_at,
          profiles:follower_id (
            id,
            username,
            display_name,
            avatar_url,
            bio,
            location,
            verified,
            created_at
          )
        `,
        )
        .eq('user_id', userProfile.id)

      if (error) {
        console.error('Error fetching followers:', error)
      }

      const mapped = (data || []).flatMap((item) => item.profiles)
      setFollowers(mapped)
      setLoading(false)
    }

    const fetchYouFollow = async () => {
      if (!currentUser?.id) return
      const { data } = await supabase
        .from('followers')
        .select('user_id')
        .eq('follower_id', currentUser.id)

      if (data) {
        setYouFollowIds(data.map((d) => d.user_id))
      }
    }

    fetchFollowers()
    fetchYouFollow()
  }, [username])

  const handleUnfollow = async (followerId: string) => {
    if (!currentUser?.id) return

    const { error } = await supabase
      .from('followers')
      .delete()
      .match({ follower_id: currentUser.id, user_id: followerId })

    if (error) {
      console.error('Unfollow error:', error)
    } else {
      setYouFollowIds((prev) => prev.filter((id) => id !== followerId))
    }
  }

  const handleFollowBack = async (userId: string) => {
    if (!currentUser?.id) return

    const { error } = await supabase
      .from('followers')
      .insert({ follower_id: currentUser.id, user_id: userId })

    if (error) {
      console.error('Follow back error:', error)
    } else {
      setYouFollowIds((prev) => [...prev, userId])
    }
  }

  const filteredFollowers = followers.filter(
    (f) =>
      f.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/profile/${username}`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Followers</h1>
              <p className="text-sm text-muted-foreground">
                {followers.length} follower{followers.length !== 1 && 's'}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search followers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-zinc-800/50 border-zinc-700 rounded-full h-12"
            />
          </div>

          {/* Followers List */}
          <div className="space-y-4">
            {filteredFollowers.map((u, index) => (
              <div
                key={u.id}
                className="slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="card-elevated rounded-2xl p-6 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300">
                  <div className="flex gap-4">
                    <Link href={`/profile/${u.username}`}>
                      <Avatar className="size-14 ring-2 ring-emerald-500/20 cursor-pointer">
                        <AvatarImage src={u.avatar_url || '/placeholder.svg'} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
                          {u.display_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1">
                      <Link href={`/profile/${u.username}`}>
                        <div className="cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground text-lg hover:text-emerald-400 transition-colors">
                              {u.display_name}
                            </h3>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            @{u.username}
                          </p>
                        </div>
                      </Link>

                      {u.bio && (
                        <p className="text-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                          {u.bio}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        {u.location && (
                          <div className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{u.location}</span>
                          </div>
                        )}
                      </div>

                      {currentUser?.id !== u.id &&
                        (youFollowIds.includes(u.id) ? (
                          <Button
                            onClick={() => handleUnfollow(u.id)}
                            className="px-6 py-2 rounded-full font-bold text-sm transition-all duration-200 button-press bg-zinc-700 text-foreground hover:bg-red-600 hover:text-white"
                          >
                            <UserMinus className="size-4 mr-2" /> Unfollow
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleFollowBack(u.id)}
                            className="px-6 py-2 rounded-full font-bold text-sm transition-all duration-200 button-press bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                          >
                            <UserPlus className="size-4 mr-2" /> Follow Back
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!loading && filteredFollowers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No followers found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No followers match "${searchQuery}"`
                    : "You don't have any followers yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomTabBar activeTab="profile" />
    </div>
  )
}
