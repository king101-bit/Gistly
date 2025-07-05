import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { TopNavbar } from '@/components/TopNavbar'
import { TrendingItem } from '@/components/TrendingItem'
import React from 'react'
const trendingTopics = [
  {
    hashtag: '#NaijaLife',
    posts: '12.5K',
    description: 'Daily life experiences in Nigeria',
  },
  {
    hashtag: '#Sapa',
    posts: '8.9K',
    description: 'Financial struggles and hustle stories',
  },
  {
    hashtag: '#ASUU',
    posts: '15.2K',
    description: 'University strikes and education issues',
  },
  { hashtag: '#Wahala', posts: '6.7K', description: 'Problems and challenges' },
  {
    hashtag: '#Japa',
    posts: '22.1K',
    description: 'Migration and relocation stories',
  },
  {
    hashtag: '#EndSARS',
    posts: '45.8K',
    description: 'Police reform movement',
  },
  {
    hashtag: '#BBNaija',
    posts: '67.3K',
    description: 'Big Brother Naija discussions',
  },
  {
    hashtag: '#NaijaTwitter',
    posts: '89.4K',
    description: 'Nigerian Twitter community',
  },
  {
    hashtag: '#Lagos',
    posts: '34.6K',
    description: 'Lagos city life and events',
  },
  {
    hashtag: '#Afrobeats',
    posts: '56.2K',
    description: 'Nigerian music and artists',
  },
]

export default function page() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <TopNavbar />
        <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
          <div className="max-w-lg lg:max-w-4xl mx-auto fade-in">
            <div className="mb-">
              <h1 className="ext-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                Trending in Nigeria <span className="text-white">🇳🇬</span>
              </h1>
              <p className="text-muted-foreground text-lg lg:text-xl">
                What's happening rn
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.hashtag}
                  className="slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TrendingItem
                    hashtag={topic.hashtag}
                    posts={topic.posts}
                    description={topic.description}
                    rank={index + 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
        <BottomTabBar activeTab="discover" />
      </div>
    </>
  )
}
