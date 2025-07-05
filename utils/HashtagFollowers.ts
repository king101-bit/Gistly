import { createClient } from './supabase/client'

const supabase = createClient()

export async function isFollowingHashtag(userId: string, hashtag: string) {
  const { data, error } = await supabase
    .from('hashtag_followers')
    .select('id')
    .eq('user_id', userId)
    .eq('hashtag', hashtag)
    .single()

  return !!data
}

export async function followHashtag(userId: string, hashtag: string) {
  const { error } = await supabase.from('hashtag_followers').insert({
    user_id: userId,
    hashtag,
  })

  return !error
}

export async function unfollowHashtag(userId: string, hashtag: string) {
  const { error } = await supabase
    .from('hashtag_followers')
    .delete()
    .eq('user_id', userId)
    .eq('hashtag', hashtag)

  return !error
}
