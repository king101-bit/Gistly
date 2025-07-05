import React from 'react'
import ThemeToggle from './theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Verified } from 'lucide-react'
import { Button } from './ui/button'

const trendingTopics = [
  {
    hashtag: '#NaijaLife',
    posts: '12.5k',
    description: 'Daily life experiences',
  },
  {
    hashtag: '#Sapa',
    posts: '8.5k',
    description: 'Financial struggles and hustle',
  },
  { hashtag: '#Japa', posts: '22.1K', description: 'Migration stories' },
  {
    hashtag: '#BBNaija',
    posts: '67.3K',
    description: 'Big Brother discussions',
  },
]

const suggestedUsers = [
  {
    name: 'Chinedu',
    username: '@chinedu',
    avatar: '/freaky_doggy.jpg',
    verified: true,
  },
  {
    name: 'Adaobi',
    username: '@adaobi',
    avatar: '/freaky_doggy.jpg',
    verified: true,
  },
  {
    name: 'Tunde',
    username: '@tunde',
    avatar: '/freaky_doggy.jpg',
    verified: false,
  },
  {
    name: 'Ngozi',
    username: '@ngozi',
    avatar: '/freaky_doggy.jpg',
    verified: false,
  },
]

const DesktopRightBar = () => {
  return (
    <>
      <aside className="hidden xl:block desktop-rightbar w-[280px] xl:w-[320px] h-screen overflow-y-auto shrink-0 sticky top-0">
        {' '}
        <div className="p-4 xl:p-6 space-y-6">
          <ThemeToggle />
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Trending in Nigeria
            </h2>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.hashtag}
                  className="p-3 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-emerald-400">
                        {topic.hashtag}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {topic.posts}
                      </p>
                    </div>
                    <span className="text-lg">{index < 2 ? '🔥' : '📈'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Who to follow
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              People you may know
            </p>
            <div className="space-y-3">
              {suggestedUsers.map((user) => (
                <div key={user.username} className="flex items-center gap-3">
                  <Avatar className="size-10 ring-2 ring-emerald-500/20">
                    <AvatarImage src={user.avatar || '/placeholder.svg'} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-foreground text-sm">
                        {user.name}
                      </p>
                      {user.verified && (
                        <span>
                          <Verified className="h-4 w-4 text-emerald-600" />
                        </span>
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
              ))}
            </div>
          </div>
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
