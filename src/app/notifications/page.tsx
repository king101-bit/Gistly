'use client'
import React, { useState } from 'react'
import FlexibleTabs from '@/components/FlexibleTabs'
import { NotificationCard } from '@/components/NotificationCard'
import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'

const notifications = [
  {
    id: 1,
    type: 'like',
    user: {
      name: 'Adunni Okafor',
      username: 'adunni_o',
      avatar:
        'https://i.pinimg.com/736x/b2/4c/3b/b24c3bcdf3c00921c90820a412d1fda8.jpg',
    },
    content: 'liked your post about japa plans',
    timestamp: '2m',
    unread: true,
  },
  {
    id: 2,
    type: 'reply',
    user: {
      name: 'Kemi Adebayo',
      username: 'kemi_codes',
      avatar:
        'https://i.pinimg.com/736x/6f/ed/ee/6fedee148f0ca6d45882a91d8c05f92e.jpg',
    },
    content: 'replied to your post: "Same here! The struggle is real 😭"',
    timestamp: '15m',
    unread: true,
  },
  {
    id: 3,
    type: 'follow',
    user: {
      name: 'Chidi Okonkwo',
      username: 'chidi_tech',
      avatar: '/placeholder.svg?height=48&width=48',
    },
    content: 'started following you',
    timestamp: '1h',
    unread: false,
  },
  {
    id: 4,
    type: 'mention',
    user: {
      name: 'Fatima Yusuf',
      username: 'fatima_writes',
      avatar: '/placeholder.svg?height=48&width=48',
    },
    content: 'mentioned you in a post about #NaijaLife',
    timestamp: '3h',
    unread: false,
  },
  {
    id: 5,
    type: 'repost',
    user: {
      name: 'Tunde Bakare',
      username: 'tunde_b',
      avatar: '/placeholder.svg?height=48&width=48',
    },
    content: 'reposted your post about Lagos traffic',
    timestamp: '5h',
    unread: false,
  },
  {
    id: 6,
    type: 'like',
    user: {
      name: 'Amaka Okafor',
      username: 'amaka_o',
      avatar: '/placeholder.svg?height=48&width=48',
    },
    content: 'liked your post about #Afrobeats',
    timestamp: '1d',
    unread: false,
  },
] as const

export default function page() {
  const [currentTab3, setCurrentTab3] = useState('all')
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <TopNavbar />
        <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
          <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
            <div className="mb-8">
              <FlexibleTabs
                tabs={['All', 'Mentions', 'Likes']}
                defaultTab="all" // ✅ This is correct
                onTabChange={setCurrentTab3}
              />
            </div>
            <div className="space-y-4">
              {currentTab3 === 'all' && (
                <div>
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className="slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <NotificationCard notification={notification} />
                    </div>
                  ))}
                </div>
              )}
              {currentTab3 === 'mentions' && <div>Mentions content</div>}
              {currentTab3 === 'likes' && <div>Likes content</div>}
            </div>
          </div>
        </main>
        <BottomTabBar activeTab="notifications" />
      </div>
    </>
  )
}
