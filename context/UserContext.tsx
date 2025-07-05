'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { UserProfile } from '../global'

const UserContext = createContext<UserProfile | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser()
      if (authData?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profile) {
          const joinedDate = new Date(authData.user.created_at)
          const formattedJoined = joinedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })

          setUser({
            ...profile,
            joined: `Joined ${formattedJoined}`,
          } as UserProfile & { joined: string })
        }
      }
    }

    fetchUser()
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
