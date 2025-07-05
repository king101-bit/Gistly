'use client'

import { useEffect, useState } from 'react'
import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, UserMinus } from 'lucide-react'
import Link from 'next/link'
import { FollowingUser } from '../../../../../global'
import { createClient } from '../../../../../utils/supabase/client'
import { useUser } from '../../../../../context/UserContext'

export default function FollowingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [following, setFollowing] = useState<FollowingUser[]>([])
  const [loading, setLoading] = useState(true)
  const currentUser = useUser()
  const supabase = createClient()

  useEffect(() => {
    if (!currentUser?.id) return

    const fetchFollowing = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('relationships')
        .select(
          `
        created_at,
        profiles:followed_id (
          id,
          display_name,
          username,
          avatar_url,
          bio,
          location,
          joined,
          verified
        )
      `,
        )
        .eq('follower_id', currentUser.id)

      if (error) {
        console.error('Error fetching following:', error)
      } else {
        setFollowing(
          data.map((item) => ({
            id: item.profiles.id,
            username: item.profiles.username,
            display_name: item.profiles.display_name,
            avatar_url: item.profiles.avatar_url,
            bio: item.profiles.bio,
            location: item.profiles.location,
            verified: item.profiles.verified ?? false,
            profile_created_at: item.profiles.joined, // if your column is `joined`
            followed_at: item.created_at, // from the relationships table
            followsYou: false, // default for now or fetch separately
          })),
        )
      }

      setLoading(false)
    }

    fetchFollowing()
  }, [currentUser?.id])

  const handleUnfollow = async (userId: string) => {
    if (!currentUser?.id) return

    const { error } = await supabase
      .from('relationships')
      .delete()
      .eq('follower_id', currentUser.id)
      .eq('followed_id', userId)

    if (error) {
      console.error('Unfollow error:', error)
    } else {
      setFollowing((prev) => prev.filter((p) => p.id !== userId))
    }
  }

  const filteredFollowing = following.filter(
    (person) =>
      person.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/profile/${currentUser?.username || ''}`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
              >
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

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search following..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-zinc-800/50 border-zinc-700 rounded-full h-12"
            />
          </div>

          {/* Following List */}
          <div className="space-y-4">
            {filteredFollowing.map((person, index) => (
              <div
                key={person.id}
                className="card-elevated rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex gap-4">
                  <Link href={`/profile/${person.username}`}>
                    <Avatar className="size-14 ring-2 ring-emerald-500/20 cursor-pointer">
                      <AvatarImage
                        src={person.avatar_url || '/placeholder.svg'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
                        {person.display_name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  <div className="flex-1">
                    <Link href={`/profile/${person.username}`}>
                      <div className="cursor-pointer">
                        <h3 className="font-bold text-lg hover:text-emerald-400 transition-colors">
                          {person.display_name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          @{person.username}
                        </p>
                      </div>
                    </Link>

                    {person.bio && (
                      <p className="text-sm text-foreground mb-3 line-clamp-2">
                        {person.bio}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      {person.location && (
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span>{person.location}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleUnfollow(person.id)}
                      className="bg-zinc-700 text-foreground hover:bg-red-600 hover:text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-200 button-press"
                    >
                      <UserMinus className="size-4 mr-2" />
                      Unfollow
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && filteredFollowing.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No one matches "${searchQuery}"`
                    : `You aren't following anyone yet`}
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
