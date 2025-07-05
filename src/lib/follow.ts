import { createClient } from '../../utils/supabase/client'

const supabase = createClient()
export async function fetchFollowerUsers(userId: string) {
  const { data, error } = await supabase
    .from('followers_view')
    .select('*')
    .eq('followed_id', userId) // who is following the user

  if (error) throw error
  return data
}

export async function getFollowing(username: string) {
  const supabase = createClient()

  // Step 1: Get user ID by username
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (userError || !user) {
    console.error('User not found:', userError)
    return []
  }

  // Step 2: Query following_view with correct column
  const { data, error } = await supabase
    .from('following_view') // this must be created as shown earlier
    .select('*')
    .eq('follower_id', user.id)

  if (error) {
    console.error('Error fetching following:', error)
    return []
  }

  return data
}
