'use client'
import { Button } from '@/components/ui/button'
import { Bell, Compass, Home, LogOut, Plus, Settings, User } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useUser } from '../../context/UserContext'
import UserAvatar from './UserAvatar'

const DesktopSidebar = () => {
  const { isAuthenticated, signOut } = useAuth()
  const user = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const Navitems = [
    { icon: Home, label: 'Home', href: '/', active: true },
    { icon: Compass, label: 'Discover', href: '/discover' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: User, label: 'Profile', href: `/profile/${user?.username || ''}` },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  // Loading state placeholder
  if (!mounted) {
    return (
      <aside className="hidden lg:block w-[280px] fixed left-0 top-0 h-screen overflow-y-auto border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col h-full p-6">
          {/* Logo skeleton */}
          <div className="mb-8">
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-32 bg-muted rounded-2xl animate-pulse" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Bottom skeleton */}
          <div className="space-y-4">
            <div className="h-12 bg-muted rounded-full animate-pulse" />
            <div className="h-16 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </aside>
    )
  }

  if (!isAuthenticated) {
    return (
      <aside className="hidden lg:block w-[280px] fixed left-0 top-0 h-screen overflow-y-auto border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/">
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent cursor-pointer">
                Gistly
              </h1>
            </Link>
          </div>

          {/* Auth Prompt */}
          <div className="w-full px-4 sm:px-6 md:px-0">
            <div className="w-full max-w-md mx-auto card-elevated rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 text-foreground">
                Join Gistly
              </h2>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Connect with Nigerians worldwide, share your gist, and stay
                updated with trending topics 🇳🇬
              </p>
              <Link href="/signin">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-full font-bold button-press glow-effect">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Limited Navigation for Guests */}
          <nav className="flex-1 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-all duration-200"
            >
              <Home className="size-6" />
              <span className="text-lg font-semibold">Explore</span>
            </Link>
            <Link
              href="/discover"
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-all duration-200"
            >
              <Compass className="size-6" />
              <span className="text-lg font-semibold">Trending</span>
            </Link>
          </nav>
        </div>
      </aside>
    )
  }

  return (
    <aside className="hidden lg:block w-[280px] fixed left-0 top-0 h-screen overflow-y-auto border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Gistly</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {Navitems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 button-press ${
                  item.active
                    ? 'text-emerald-400 bg-emerald-400/10 glow-effect'
                    : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="size-6" />
                <span className="text-lg font-semibold">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Post button */}
        <div className="mb-6">
          <Link href="/post">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-700 text-white py-4 rounded-full font-bold text-lg button-press glow-effect">
              <Plus className="size-5 mr-2" />
              Post
            </Button>
          </Link>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer">
          <UserAvatar className="size-12 shrink-0 ring-2 ring-emerald-500/20" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground dark:text-white">
              {user?.display_name}
            </p>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
          </div>
          <Button
            className="shrink-0 text-muted-foreground hover:text-foreground"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              signOut()
            }}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default DesktopSidebar
