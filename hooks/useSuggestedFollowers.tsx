'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'

export interface SuggestedUser {
  id: string
  display_name: string
  username: string
  avatar_url: string | null
  verified: boolean
}

export function useSuggestedUsers(limit = 5) {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchSuggestions = async () => {
      setLoading(true)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (!user || userError) {
        console.error('Failed to get user', userError)
        setLoading(false)
        return
      }

      const { data: following, error } = await supabase
        .from('followers')
        .select('user_id')
        .eq('follower_id', user.id)

      const followedIds = following?.map((f) => f.user_id) || []

      const { data: suggestions, error: suggestionsError } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url, verified')
        .not('id', 'in', `(${[...followedIds, user.id].join(',')})`)
        .limit(limit)

      if (suggestionsError) {
        console.error('Failed to fetch suggestions:', suggestionsError)
      } else {
        setSuggestedUsers(suggestions)
      }

      setLoading(false)
    }

    fetchSuggestions()
  }, [limit])

  return { suggestedUsers, loading }
}
