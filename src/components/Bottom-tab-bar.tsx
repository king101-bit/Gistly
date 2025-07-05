import Link from 'next/link'
import { Home, Compass, Plus, Bell, User } from 'lucide-react'

interface BottomTabBarProps {
  activeTab: 'home' | 'discover' | 'post' | 'notifications' | 'profile'
}

export function BottomTabBar({ activeTab }: BottomTabBarProps) {
  const tabs = [
    { id: 'home', icon: Home, href: '/', label: 'Home' },
    { id: 'discover', icon: Compass, href: '/discover', label: 'Discover' },
    { id: 'post', icon: Plus, href: '/post', label: 'Post' },
    {
      id: 'notifications',
      icon: Bell,
      href: '/notifications',
      label: 'Notifications',
    },
    { id: 'profile', icon: User, href: '/profile', label: 'Profile' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border z-50 shadow-lg shadow-black/20">
      <div className="max-w-lg mx-auto px-4 h-20 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 button-press ${
                isActive
                  ? 'text-emerald-400 glow-effect bg-emerald-400/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800/50'
              }`}
            >
              <Icon
                className={`size-6 ${tab.id === 'post' && isActive ? 'bg-emerald-500 p-1 rounded-full' : ''}`}
              />
              <span className="text-xs font-semibold">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
