'use client'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { TopNavbar } from '@/components/TopNavbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  Palette,
  Shield,
  User,
} from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { signOut } from '@/lib/auth-actions'

const settingsItems = [
  {
    category: 'Account',
    items: [
      {
        icon: User,
        label: 'Profile Settings',
        description: 'Edit your profile information',
        href: '/settings/profile',
      },
      {
        icon: Shield,
        label: 'Privacy & Safety',
        description: 'Control who can see your content',
        href: '/settings/privacy',
      },
      {
        icon: Bell,
        label: 'Notifications',
        description: 'Manage your notification preferences',
        href: '/settings/notifications',
      },
    ],
  },
  {
    category: 'Appearance',
    items: [
      {
        icon: Palette,
        label: 'Theme',
        description: 'Choose your preferred theme',
        href: '/settings/theme',
      },
      {
        icon: Globe,
        label: 'Language',
        description: 'Select your language',
        href: '/settings/language',
      },
    ],
  },
  {
    category: 'Support',
    items: [
      {
        icon: HelpCircle,
        label: 'Help Center',
        description: 'Get help and support',
        href: '/help',
      },
      {
        icon: Shield,
        label: 'Terms of Service',
        description: 'Read our terms',
        href: '/terms',
      },
      {
        icon: Shield,
        label: 'Privacy Policy',
        description: 'Read our privacy policy',
        href: '/privacy',
      },
    ],
  },
]

export default function page() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    displayName: 'Your Name',
    username: 'your_username',
    bio: 'Software Engineer & Tech Enthusiast 🚀 Building the future from Lagos, Nigeria 🇳🇬 Passionate about African innovation and good jollof rice 😄',
    location: 'Lagos, Nigeria',
    website: 'yourwebsite.com',
    birthDate: '1995-03-15',
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Failed to get user:', userError?.message)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        return
      }

      if (data) {
        setAvatarUrl(data.avatar_url || null)
        setFormData({
          displayName: data.display_name || '',
          username: data.username || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          birthDate: data.birth_date || '',
        })
      }
    }

    fetchProfile()
  }, [])

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <TopNavbar />
        <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
          <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">Settings</h1>
              <p className="text-muted-foreground text-lg">
                Manage your account and preferences
              </p>
            </div>
            <div className="card-elevated rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 ring-2 ring-emerald-500/20">
                  <AvatarImage src={avatarUrl || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xl">
                    {formData.displayName
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {formData.displayName || 'Guest'}
                  </h2>
                  <p className="text-muted-foreground">
                    @{formData.username || 'Jonnydoe'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    5,678 followers • 1,234 following
                  </p>
                </div>
                <Link href="/settings/profile">
                  <Button
                    variant="outline"
                    className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black dark:hover:text-white bg-transparent"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-6">
              {settingsItems.map((category) => (
                <div
                  key={category.category}
                  className="card-elevated rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label}>
                          <Link href={`${item.href}`}>
                            <button
                              key={item.label}
                              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors button-press"
                            >
                              <Icon className="size-5 text-emerald-400" />
                              <div className="flex-1 text-left">
                                <p className="font-medium text-foreground">
                                  {item.label}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <ChevronRight className="size-5 text-muted-foreground" />
                            </button>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="card-elevated rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-400/10 transition-colors button-press text-red-400"
                >
                  <LogOut className="size-5" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm text-red-400/70">
                      Sign out of your account
                    </p>
                  </div>
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </main>
        <BottomTabBar activeTab="profile" />
      </div>
    </>
  )
}
