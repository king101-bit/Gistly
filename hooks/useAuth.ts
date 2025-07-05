'use client'

import {
  signIn as serverSignIn,
  signUp as serverSignUp,
} from '@/lib/auth-actions'
import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'

export function useAuth() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check auth status on mount and when auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      await serverSignIn(formData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: {
    displayName: string
    username: string
    email: string
    password: string
  }) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('displayName', data.displayName)
    formData.append('username', data.username)

    try {
      await serverSignUp(formData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    signOut,
  }
}
