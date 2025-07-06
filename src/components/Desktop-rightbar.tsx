'use client'

import React, { useEffect, useState } from 'react'
import ThemeToggle from './theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Verified } from 'lucide-react'
import { Button } from './ui/button'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import { useSuggestedUsers } from '../../hooks/useSuggestedFollowers'

const DesktopRightBar = () => {
  const { suggestedUsers, loading } = useSuggestedUsers(5)
  const [trendingTopics, setTrendingTopics] = useState<
    { hashtag: string; posts: number }[]
  >([])

  useEffect(() => {
    const supabase = createClient()

    async function fetchTrendingHashtags() {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('content')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error fetching posts:', error)
        return
      }

      const hashtagCounts: Record<string, number> = {}

      posts?.forEach((post) => {
        const tags = (post.content?.match(/#\w+/g) || []).map((t: string) =>
          t.toLowerCase(),
        )
        tags.forEach((tag: string) => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
        })
      })

      const sorted = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([hashtag, count]) => ({
          hashtag: hashtag.replace(/^#/, ''),
          posts: count,
        }))
        .slice(0, 5)

      setTrendingTopics(sorted)
    }

    fetchTrendingHashtags()
  }, [])

  return (
    <>
      <aside className="hidden xl:block desktop-rightbar w-[280px] xl:w-[320px] h-screen overflow-y-auto shrink-0 sticky top-0">
        <div className="p-4 xl:p-6 space-y-6">
          <ThemeToggle />

          {/* Trending Section */}
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Trending in Nigeria
            </h2>
            <div className="space-y-3">
              {trendingTopics.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Loading trends...
                </p>
              ) : (
                trendingTopics.map((topic, index) => (
                  <Link
                    key={topic.hashtag}
                    href={`/topic/${encodeURIComponent(topic.hashtag)}`}
                  >
                    <div className="p-3 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-emerald-400">
                            #{topic.hashtag}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {topic.posts} posts
                          </p>
                        </div>
                        <span className="text-lg">
                          {index < 2 ? '🔥' : '📈'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Who to Follow */}
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Who to follow
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              People you may know
            </p>
            <div className="space-y-3">
              {loading ? (
                <p className="text-muted-foreground text-sm">
                  Loading suggestions...
                </p>
              ) : (
                suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-emerald-500/20">
                      <AvatarImage
                        src={user.avatar_url || '/placeholder.svg'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
                        {user.display_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <Link href={`/profile/${user.username}`}>
                          <p className="font-semibold text-foreground text-sm">
                            {user.display_name}
                          </p>
                        </Link>
                        {user.verified && (
                          <Verified className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>

                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded-full text-xs font-semibold">
                      Follow
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-zinc-500 space-y-2">
            <div className="flex flex-wrap gap-2">
              <a href="#" className="hover:text-zinc-400">
                Terms
              </a>
              <a href="#" className="hover:text-zinc-400">
                Privacy
              </a>
              <a href="#" className="hover:text-zinc-400">
                About
              </a>
              <a href="#" className="hover:text-zinc-400">
                Help
              </a>
            </div>
            <p>© {new Date().getFullYear()} NaijaConnect</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default DesktopRightBar
