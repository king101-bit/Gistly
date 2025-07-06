import { useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'
import { useUser } from '../context/UserContext'

const allowedTypes = ['like', 'reply', 'follow', 'mention', 'repost'] as const
type NotificationType = (typeof allowedTypes)[number]

type UINotification = {
  id: string
  type: NotificationType
  content: string
  timestamp: string
  unread: boolean
  user: {
    name: string
    username: string
    avatar: string
  }
}

export function useNotifications() {
  const supabase = createClient()
  const user = useUser()
  const [notifications, setNotifications] = useState<UINotification[]>([])

  function isValidType(type: string): type is NotificationType {
    return allowedTypes.includes(type as NotificationType)
  }

  useEffect(() => {
    if (!user?.id) return

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select(
          `
          id,
          type,
          content,
          created_at,
          is_read,
          from_user:from_user_id (
            username,
            display_name,
            avatar_url
          )
        `,
        )
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      const mapped: UINotification[] = (data || [])
        .filter((n) => isValidType(n.type) && n.from_user)
        .map((n) => {
          const sender = Array.isArray(n.from_user)
            ? n.from_user[0]
            : n.from_user

          return {
            id: n.id,
            type: n.type as NotificationType,
            content: n.content,
            timestamp: n.created_at,
            unread: !n.is_read,
            user: {
              name: sender.display_name || 'Unknown',
              username: sender.username || 'unknown',
              avatar: sender.avatar_url || '/placeholder.svg',
            },
          }
        })

      setNotifications(mapped)
    }

    fetchNotifications()
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel('notifications-feed')

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const n = payload.new
          if (!isValidType(n.type)) return

          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username, avatar_url')
            .eq('id', n.from_user_id)
            .maybeSingle()

          const newNotification: UINotification = {
            id: n.id,
            type: n.type,
            content: n.content,
            timestamp: n.created_at,
            unread: true,
            user: {
              name: profile?.display_name || 'Unknown',
              username: profile?.username || 'unknown',
              avatar: profile?.avatar_url || '/placeholder.svg',
            },
          }

          setNotifications((prev) => [newNotification, ...prev])
        },
      )

      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  return notifications
}
