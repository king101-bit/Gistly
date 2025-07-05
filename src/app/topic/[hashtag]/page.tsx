import { BottomTabBar } from '@/components/Bottom-tab-bar'
import PostCard from '@/components/post-card'
import { TopNavbar } from '@/components/TopNavbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Hash, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const hashtagData = {
  hashtag: '#Sapa',
  posts: '8.9k',
  followers: '2.3k',
  trending: true,
  rank: 2,
}
const relatedHashtags = [
  '#NaijaLife',
  '#NaijaStruggles',
  '#Hustle',
  '#NaijaHustle',
  '#SmallBusiness',
  '#EndBadGovernance',
  '#EconomicCrisis',
  '#SurvivalMode',
]

const hashtagPosts = [
  {
    id: 1,
    user: {
      name: 'Kemi Adebayo',
      username: 'kemi_codes',
      avatar: '/placeholder.svg?height=48&width=48',
      location: 'Abuja',
    },
    content:
      'Fuel price don increase again 😤 This #Sapa is getting out of hand. How person wan survive for this country? #NaijaStruggles #EndBadGovernance',
    timestamp: '4h',
    reactions: { fire: 45, laugh: 12, heart: 67 },
    replies: 23,
    reposts: 15,
  },
  {
    id: 2,
    user: {
      name: 'Tunde Bakare',
      username: 'tunde_b',
      avatar: '/placeholder.svg?height=48&width=48',
      location: 'Ibadan',
    },
    content:
      "This #Sapa don tire me o! 😭 I've been eating bread and tea for the past week. When will this economy get better? #NaijaLife #Hustle",
    timestamp: '6h',
    reactions: { fire: 28, laugh: 8, heart: 45 },
    replies: 15,
    reposts: 9,
  },
  {
    id: 3,
    user: {
      name: 'Amaka Okafor',
      username: 'amaka_o',
      avatar: '/placeholder.svg?height=48&width=48',
      location: 'Enugu',
    },
    content:
      'The #Sapa is real but we keep pushing! 💪 Started a small business selling plantain chips. Every naira counts! #SmallBusiness #NaijaHustle',
    timestamp: '8h',
    reactions: { fire: 67, laugh: 5, heart: 89 },
    replies: 32,
    reposts: 18,
  },
  {
    id: 4,
    user: {
      name: 'Emeka Okafor',
      username: 'emeka_dev',
      avatar: '/placeholder.svg?height=48&width=48',
      location: 'Lagos',
    },
    content:
      'Learning to code because of #Sapa 😂 Tech skills might be my way out of this financial struggle. Anyone know good free resources? #LearnToCode',
    timestamp: '12h',
    reactions: { fire: 34, laugh: 12, heart: 56 },
    replies: 28,
    reposts: 14,
  },
  {
    id: 5,
    user: {
      name: 'Blessing Adamu',
      username: 'blessing_writes',
      avatar: '/placeholder.svg?height=48&width=48',
      location: 'Kaduna',
    },
    content:
      "My parents keep asking when I'll get married but this #Sapa won't even let me take care of myself 😅 Marriage na luxury now o! #SingleLife",
    timestamp: '1d',
    reactions: { fire: 78, laugh: 45, heart: 123 },
    replies: 67,
    reposts: 34,
  },
]

export default function page({ params }: { params: { hashtag: string } }) {
  const decodedHashtag = decodeURIComponent(params.hashtag)
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <TopNavbar />
        <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
          <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/discover">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
                >
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{decodedHashtag}</h1>
                <p className="text-sm text-muted-foreground">Trending topic</p>
              </div>
            </div>
            <div className="card-elevated rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-400/10 rounded-full">
                  <Hash className="size-8 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-emerald-400">
                      {decodedHashtag}
                    </h2>
                    {hashtagData.trending && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-400/10 rounded-full">
                        <TrendingUp className="size-3 text-red-400" />
                        <span className="text-xs text-red-400 font-semibold">
                          #{hashtagData.rank} Trending
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Explore posts tagged with <strong>{decodedHashtag}</strong>
                  </p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Hash className="size-4" />
                      <span>{hashtagData.posts} posts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="size-4" />
                      <span>{hashtagData.followers} following</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full font-bold button-press glow-effect">
                    Follow Topic
                  </Button>
                </div>
              </div>
            </div>
            {/* Related Hashtags */}
            <div className="card-elevated rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {relatedHashtags.map((tag) => (
                  <Link key={tag} href={`/topic/${encodeURIComponent(tag)}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-full px-3 py-1 text-sm button-press"
                    >
                      {tag}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-6 text-lg mb-6">
              <button className="text-emerald-400 font-bold border-b-2 border-emerald-400 pb-2">
                Latest
              </button>
              <button className="text-muted-foreground hover:text-foreground pb-2 transition-colors">
                Top
              </button>
              <button className="text-muted-foreground hover:text-foreground pb-2 transition-colors">
                People
              </button>
              <button className="text-muted-foreground hover:text-foreground pb-2 transition-colors">
                Media
              </button>
            </div>
            <div className="space-y-6">
              {hashtagPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}

              {/* Load More */}
              <div className="text-center pt-6">
                <Button
                  variant="ghost"
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 px-8 py-3 rounded-full"
                >
                  Load more posts
                </Button>
              </div>
            </div>
          </div>
        </main>
        <BottomTabBar activeTab="discover" />
      </div>
    </>
  )
}
