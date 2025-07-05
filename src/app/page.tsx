'use client'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import PostCard from '@/components/post-card'
import PostComposer from '@/components/PostComposer'
import { TopNavbar } from '@/components/TopNavbar'
import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { Post } from '../../global'
import { PostCardSkeleton } from '@/components/skeleton/post-card-skeleton'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(
            `
            *,
            profiles:user_id(id, display_name, username, avatar_url, location),
            post_media(id, url, type, alt, thumbnail, duration)
          `,
          )
          .order('created_at', { ascending: false })

        if (error) throw error

        setPosts(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (error) return <div>Error: {error}</div>
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground px-6 pt-20 pb-24">
        <TopNavbar />
        <main className="max-w-lg lg:max-w-2xl mx-auto space-y-6">
          <div className="hidden lg:block">
            <PostComposer />
          </div>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </main>
        <BottomTabBar activeTab="home" />
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <TopNavbar />
        <main className="pt-20 pb-24 lg:pb-8 px-6 lg:px-12 xl:px-16">
          <div className="max-w-lg lg:max-w-2xl mx-auto space-y-6 fade-in">
            <div className="hidden lg:block">
              <PostComposer />
            </div>
            {posts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </main>
        <BottomTabBar activeTab="home" />
      </div>
    </>
  )
}
