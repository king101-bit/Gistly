import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TrendingItemProps {
  hashtag: string
  posts: string
  description: string
  rank: number
}

export function TrendingItem({
  hashtag,
  posts,
  description,
  rank,
}: TrendingItemProps) {
  const getRankEmoji = (rank: number) => {
    if (rank <= 3) return '🔥'
    if (rank <= 6) return '📈'
    return '💬'
  }

  return (
    <div className="card-elevated rounded-2xl p-6 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-muted-foreground font-medium">
              #{rank} Trending in Nigeria
            </span>
            <TrendingUp className="size-4 text-emerald-400" />
            <span className="text-2xl">{getRankEmoji(rank)}</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">
            {hashtag}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
            {description}
          </p>
          <p className="text-sm text-zinc-500 font-semibold">{posts} posts</p>
        </div>
        <Link href={`/topic/${encodeURIComponent(hashtag)}`}>
          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full font-bold button-press glow-effect">
            Join Topic
          </Button>
        </Link>
      </div>
    </div>
  )
}
