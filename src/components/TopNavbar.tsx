'use client'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../hooks/useAuth'
import Link from 'next/link'
import UserAvatar from './UserAvatar'

export function TopNavbar() {
  const [showSearch, setShowSearch] = useState(false)
  const { isAuthenticated, user } = useAuth()

  return (
    <nav className="lg:hidden fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border z-50 shadow-lg shadow-black/20">
      <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-between">
        {!showSearch ? (
          <>
            <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Gistly
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full p-3 button-press"
            >
              <Search className="size-5" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Search Gistly..."
              className="h-10 flex-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full p-2"
            >
              <X className="size-5" />
            </Button>
          </div>
        )}
        {isAuthenticated ? (
          <Link href="/profile">
            <UserAvatar />
          </Link>
        ) : (
          <Link href="/signin">
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full font-bold text-sm button-press glow-effect">
              Join
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
