'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner'

interface PostActionsDropdownProps {
  isOwner: boolean
  onEdit?: () => void
  onDelete?: () => void
  onReport?: () => void
  onMute?: () => void
  onBlock?: () => void
  onContinueThread?: () => void
}

export async function deletePost(
  postId: number,
  router: ReturnType<typeof useRouter>,
) {
  const supabase = createClient()

  const { error } = await supabase.from('posts').delete().eq('id', postId)

  if (error) {
    console.error('Failed to delete post:', error)
    return false
  }
  toast('Post deleted!')
  router.push('/')
  return true
}
export async function deleteComment(commentId: number) {
  const supabase = createClient()

  const { error } = await supabase.from('comments').delete().eq('id', commentId)

  if (error) {
    console.error('Failed to delete comment:', error)
    return false
  }

  return true
}

export function PostActionsDropdown({
  isOwner,
  onEdit,
  onDelete,
  onReport,
  onMute,
  onBlock,
}: PostActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full p-1 button-press flex-shrink-0"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-44">
        {isOwner ? (
          <>
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>✏️ Edit</DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-500 hover:text-red-600"
              >
                ❌ Delete
              </DropdownMenuItem>
            )}
          </>
        ) : (
          <>
            {onReport && (
              <DropdownMenuItem onClick={onReport}>🚩 Report</DropdownMenuItem>
            )}
            {onMute && (
              <DropdownMenuItem onClick={onMute}>🙈 Mute User</DropdownMenuItem>
            )}
            {onBlock && (
              <DropdownMenuItem onClick={onBlock}>🚫 Block</DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
