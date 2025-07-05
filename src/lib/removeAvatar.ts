import { toast } from 'sonner'
import { createClient } from '../../utils/supabase/client'

export async function removeAvatar(userId: string) {
  const supabase = createClient()

  // List files in the user's folder
  const { data: listData, error: listError } = await supabase.storage
    .from('avatars')
    .list(userId)

  if (listError) {
    toast('Failed to list avatar files')
    return { success: false }
  }

  const avatarFile = listData?.find((file) => file.name.startsWith('avatar'))
  if (!avatarFile) {
    toast('No avatar found to delete')
    return { success: false }
  }

  const filePath = `${userId}/${avatarFile.name}`
  const { error: deleteError } = await supabase.storage
    .from('avatars')
    .remove([filePath])

  if (deleteError) {
    toast('Failed to delete avatar')
    return { success: false }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', userId)

  if (updateError) {
    toast('Failed to update profile')
    return { success: false }
  }

  toast('Avatar removed successfully')
  return { success: true }
}
