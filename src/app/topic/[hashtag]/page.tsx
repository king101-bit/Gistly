'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Hash, TrendingUp, Users } from 'lucide-react'

import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/post-card'
import { createClient } from '../../../../utils/supabase/client'
import { useUser } from '../../../../context/UserContext'
import { useHashtagFollow } from '../../../../hooks/UseHashtagFollow'
import FlexibleTabs from '@/components/FlexibleTabs'

export default function TopicPage() {
  const { hashtag } = useParams()
  const decodedHashtag = decodeURIComponent(hashtag as string)

  const supabase = createClient()
  const user = useUser()
  const { isFollowing, loading, toggleFollow } =
    useHashtagFollow(decodedHashtag)
  const [currentTab, setCurrentTab] = useState('latest')
  const [posts, setPosts] = useState<any[]>([])
  const [sortMode, setSortMode] = useState<'latest' | 'top'>('latest')
  const [followerCount, setFollowerCount] = useState(0)
  const [postCount, setPostCount] = useState(0)
  const sortedPosts =
    sortMode === 'top'
      ? [...posts].sort((a, b) => b.topScore - a.topScore)
      : posts

  useEffect(() => {
    fetchPosts()
    fetchStats()
  }, [decodedHashtag, user?.id])
  const fetchPosts = async () => {
    const { data: rawPosts, error } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .ilike('content', `%#${decodedHashtag}%`)
      .order('created_at', { ascending: false })

    if (error || !rawPosts) return

    const scoredPosts = await Promise.all(
      rawPosts.map(async (post) => {
        const { data: comments } = await supabase
          .from('comments')
          .select('id')
          .eq('post_id', post.id)

        const commentCount = comments?.length || 0
        const fire = post.fire_reactions || 0
        const laugh = post.laugh_reactions || 0
        const heart = post.heart_reactions || 0

        const reactionScore = fire + laugh + heart
        const hoursSince =
          (Date.now() - new Date(post.created_at).getTime()) / 1000 / 3600

        const topScore =
          (reactionScore * 3 + commentCount * 2) / (hoursSince + 1)

        return { ...post, topScore }
      }),
    )

    setPosts(scoredPosts)
    setPostCount(scoredPosts.length)
  }

  const fetchStats = async () => {
    const { count } = await supabase
      .from('hashtag_followers')
      .select('*', { count: 'exact', head: true })
      .eq('hashtag', decodedHashtag)

    setFollowerCount(count || 0)

    const { data: follow } = await supabase
      .from('hashtag_followers')
      .select('*')
      .eq('hashtag', decodedHashtag)
      .eq('user_id', user?.id)
      .single()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />
      <main className="pt-20 pb-24 px-4 lg:px-8">
        <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/discover">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full button-press"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold">#{decodedHashtag}</h1>
              <p className="text-sm text-muted-foreground">Trending topic</p>
            </div>
          </div>

          {/* Hashtag Info Card */}
          <div className="card-elevated rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-400/10 rounded-full">
                <Hash className="size-8 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-emerald-400 mb-1">
                  {decodedHashtag}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Explore posts tagged with <strong>{decodedHashtag}</strong>
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Hash className="size-4" />
                    <span>{postCount} posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-4" />
                    <span>{followerCount} following</span>
                  </div>
                </div>
                <Button
                  disabled={loading}
                  onClick={toggleFollow}
                  className={`bg-gradient-to-r ${
                    isFollowing
                      ? 'from-red-500 to-red-600'
                      : 'from-emerald-500 to-emerald-600'
                  } hover:brightness-110 text-white px-6 py-2 rounded-full font-bold button-press glow-effect`}
                >
                  {isFollowing ? 'Unfollow Topic' : 'Follow Topic'}
                </Button>
              </div>
            </div>
          </div>

          <FlexibleTabs
            tabs={['Latest', 'Top', 'People', 'Media']}
            defaultTab="latest"
            onTabChange={setCurrentTab}
          />
          <div className="space-y-6">
            {currentTab === 'latest' && (
              <div className="mt-4">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
            {currentTab === 'top' && (
              <div className="mt-4">
                {sortedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="slide-up mt-3"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
            {/* Posts */}
            <div className="space-y-6">
              {/* Load more */}
              {posts.length > 10 && (
                <div className="text-center pt-6">
                  <Button
                    variant="ghost"
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 px-8 py-3 rounded-full"
                  >
                    Load more posts
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomTabBar activeTab="discover" />
    </div>
  )
}
