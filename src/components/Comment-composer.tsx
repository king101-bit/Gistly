'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Smile, ImageIcon, X, Reply } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner'
import { MediaUploader } from './MediaUploader'
import { CommentType, MediaItem } from '../../global'

interface CommentComposerProps {
  postId: number
  parentId?: number
  replyingTo?: Pick<CommentType, 'id'> & {
    profiles: {
      username: string
    }
  }

  placeholder?: string
  onCancel?: () => void
  onNewComment?: (comment: CommentType) => void
  compact?: boolean
  level?: number
}

export function CommentComposer({
  postId,
  parentId,
  replyingTo,
  placeholder = 'Post your reply...',
  onCancel,
  onNewComment,
  compact = false,
  level = 0,
}: CommentComposerProps) {
  const [commentContent, setCommentContent] = useState(
    replyingTo ? `@${replyingTo.profiles.username} ` : '',
  )
  const [media, setMedia] = useState<MediaItem[]>([])
  const supabase = createClient()
  const user = useUser()
  const maxChars = 280

  useEffect(() => {
    if (replyingTo) {
      const textarea = document.querySelector('textarea')
      textarea?.focus()
    }
  }, [replyingTo])

  const handleSubmit = async () => {
    if ((!commentContent.trim() && media.length === 0) || !user) return

    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .insert([
          {
            content: commentContent,
            post_id: postId,
            user_id: user.id,
            parent_id: parentId || null,
          },
        ])
        .select()
        .single()

      if (error || !comment) throw error

      let uploadedMedia: MediaItem[] = []
      if (media.length > 0) {
        const uploadData = media.map((item) => ({
          url: item.url,
          type: item.type,
          thumbnail: item.thumbnail || null,
          alt: item.alt || null,
          duration: item.duration || null,
          comment_id: comment.id,
          user_id: user.id,
        }))

        const { data: uploadedMediaData, error: mediaError } = await supabase
          .from('comment_media')
          .insert(uploadData)
          .select()

        if (mediaError) throw mediaError
        uploadedMedia = uploadedMediaData
      }

      if (onNewComment) {
        onNewComment({
          ...comment,
          comment_media: uploadedMedia,
          profiles: {
            display_name: user.display_name,
            username: user.username,
            avatar_url: user.avatar_url,
            location: user.location || null,
          },
        })
      }

      setCommentContent(replyingTo ? `@${replyingTo.profiles.username} ` : '')
      setMedia([])
      toast.success(parentId ? 'Reply posted!' : 'Comment posted!')
      onCancel?.()
    } catch (err) {
      toast.error('Failed to post comment')
      console.error(err)
    }
  }

  const isReply = !!replyingTo
  const isNested = level > 0

  const getComposerStyle = () => {
    if (isNested) return 'bg-zinc-900/40 border border-zinc-800/50'
    if (isReply) return 'bg-zinc-900/60 border border-emerald-500/20'
    return 'card-elevated'
  }

  return (
    <div className={`rounded-2xl p-4 ${getComposerStyle()}`}>
      {isReply && replyingTo && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-800/50">
          <Reply className="size-4 text-emerald-400" />
          <span className="text-sm text-muted-foreground">
            Replying to{' '}
            <span className="text-emerald-400 font-medium">
              @{replyingTo.profiles.username}
            </span>
          </span>
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="ml-auto text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 p-1 rounded-full"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Avatar
          className={`${compact ? 'size-8' : 'size-10'} ring-2 ring-emerald-500/20 flex-shrink-0`}
        >
          <AvatarImage src={user?.avatar_url || '/placeholder.svg'} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
            {user?.display_name
              ?.split(' ')
              .map((n) => n[0])
              .join('') || 'YU'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <Textarea
            placeholder={placeholder}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className={`bg-transparent border-none resize-none placeholder:text-muted-foreground focus-visible:ring-0 p-2 font-medium leading-relaxed ${
              compact ? 'min-h-[50px] text-sm' : 'min-h-[60px]'
            }`}
            maxLength={maxChars}
            autoFocus={isReply}
          />

          <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
            <div className="flex gap-2">
              <MediaUploader
                supabase={supabase}
                userId={user?.id}
                onUploadSuccess={(mediaData) =>
                  setMedia((prev) => [...prev, ...mediaData])
                }
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-2 rounded-full button-press"
              >
                <Smile className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`text-xs font-medium ${
                  commentContent.length > maxChars * 0.9
                    ? 'text-red-400'
                    : commentContent.length > maxChars * 0.7
                      ? 'text-yellow-400'
                      : 'text-muted-foreground'
                }`}
              >
                {commentContent.length}/{maxChars}
              </div>
              <Button
                onClick={handleSubmit}
                className={`px-4 py-1 rounded-full font-bold text-sm transition-all duration-200 button-press ${
                  commentContent.trim() || media.length > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white glow-effect'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                }`}
                disabled={!commentContent.trim() && media.length === 0}
              >
                {isReply ? 'Reply' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
