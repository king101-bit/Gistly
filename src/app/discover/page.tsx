'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { TrendingItem } from '@/components/TrendingItem'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { TopNavbar } from '@/components/TopNavbar'

export default function TrendingPage() {
  const [trendingTopics, setTrendingTopics] = useState<
    { hashtag: string; posts: number }[]
  >([])

  useEffect(() => {
    const supabase = createClient()

    async function fetchTrending() {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('content')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Failed to fetch posts:', error)
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
          hashtag: hashtag.replace('#', ''),
          posts: count,
        }))
        .slice(0, 10)

      setTrendingTopics(sorted)
    }

    fetchTrending()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />
      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-lg lg:max-w-4xl mx-auto fade-in">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Trending in Nigeria 🇳🇬
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl">
              What's happening right now
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
            {trendingTopics.map((topic, index) => (
              <div
                key={topic.hashtag}
                className="slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TrendingItem
                  hashtag={topic.hashtag}
                  posts={topic.posts}
                  rank={index + 1}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomTabBar activeTab="discover" />
    </div>
  )
}
