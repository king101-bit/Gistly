'use client'
import React, { useState } from 'react'
import FlexibleTabs from '@/components/FlexibleTabs'
import { NotificationCard } from '@/components/NotificationCard'
import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { useNotifications } from '../../../hooks/useNotification'
import { useUser } from '../../../context/UserContext'

export default function page() {
  const user = useUser()
  const notifications = useNotifications()
  const mentions = notifications.filter((n) => n.type === 'mention')
  const likes = notifications.filter((n) => n.type === 'like')

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
                defaultTab="all"
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

              {currentTab3 === 'mentions' && (
                <div>
                  {mentions.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}

              {currentTab3 === 'likes' && (
                <div>
                  {likes.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <BottomTabBar activeTab="notifications" />
      </div>
    </>
  )
}
