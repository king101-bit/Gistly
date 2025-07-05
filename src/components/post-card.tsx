'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Repeat2, Share } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { VideoPlayer } from './VideoPlayer'
import { MediaGrid } from './MediaGrid'
import { useAuth } from '../../hooks/useAuth'
import { AuthButtons } from './AuthButtons'
import {
  CommentType,
  MediaItem,
  Post,
  PostMedia,
  ReactionGroup,
} from '../../global'
import { useUser } from '../../context/UserContext'
import { createClient } from '../../utils/supabase/client'
import { deletePost, PostActionsDropdown } from './PostActionsDropdown'
import { toast } from 'sonner'
import { EditPostModal } from './edit-post-modal'

interface PostCardProps {
  post: Post
  detailed?: boolean
}

export default function PostCard({ post, detailed = false }: PostCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const user = useUser()
  const supabase = createClient()
  const [isEditing, setIsEditing] = useState(false)
  const [localPost, setLocalPost] = useState(post)
  const emojiStyles: Record<string, string> = {
    '❤️': 'bg-red-500/20 text-red-500',
    '🔥': 'bg-amber-500/20 text-amber-500',
    '😂': 'bg-yellow-400/20 text-yellow-500',
  }
  const [reactions, setReactions] = useState<ReactionGroup[]>([])

  useEffect(() => {
    async function fetchReactions() {
      const { data, error } = await supabase
        .from('reactions')
        .select('emoji, user_id')
        .eq('target_type', 'post')
        .eq('target_id', post.id)

      if (error) {
        console.error('Failed to fetch reactions:', error)
        return
      }
      console.log(localPost.comment)
      const grouped = Object.values(
        (data || []).reduce(
          (acc, r) => {
            if (!acc[r.emoji]) {
              acc[r.emoji] = {
                emoji: r.emoji,
                count: 0,
                reactedByMe: false,
              }
            }
            acc[r.emoji].count += 1
            if (r.user_id === user?.id) acc[r.emoji].reactedByMe = true
            return acc
          },
          {} as Record<string, ReactionGroup>,
        ),
      )

      setReactions(grouped)
    }

    fetchReactions()
  }, [post.id, user?.id])

  const handleReact = async (emoji: string) => {
    const existing = reactions.find((r) => r.emoji === emoji && r.reactedByMe)

    if (existing) {
      // Remove reaction
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('user_id', user?.id)
        .eq('target_type', 'post')
        .eq('target_id', post.id)
        .eq('emoji', emoji)

      if (!error) {
        setReactions((prev) =>
          prev.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count - 1, reactedByMe: false }
              : r,
          ),
        )
      }
    } else {
      // Add reaction
      const { error } = await supabase.from('reactions').insert({
        user_id: user?.id,
        target_type: 'post',
        target_id: post.id,
        emoji,
      })

      if (!error) {
        const exists = reactions.find((r) => r.emoji === emoji)
        setReactions((prev) =>
          exists
            ? prev.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, reactedByMe: true }
                  : r,
              )
            : [...prev, { emoji, count: 1, reactedByMe: true }],
        )
      }
    }
  }

  const normalizePostMediaToMediaItem = (media: PostMedia[]): MediaItem[] => {
    return media.map(({ thumbnail, duration, ...rest }) => ({
      ...rest,
      thumbnail: thumbnail ?? undefined,
      duration: duration ?? undefined,
    }))
  }

  const processContent = (content: string) =>
    content.replace(/#(\w+)/g, (match) => {
      return `<a href="/topic/${encodeURIComponent(
        match,
      )}" class="hashtag-highlight hover:underline">${match}</a>`
    })

  const createdAtDate = new Date(post.created_at)
  const timeAgo =
    post.created_at && !isNaN(createdAtDate.getTime())
      ? formatDistanceToNow(createdAtDate, { addSuffix: true })
      : 'Invalid date'

  const handleEditPost = async (updatedPost: Post) => {
    try {
      // Start a transaction-like approach
      // First, update the post content and location
      const { error: postError } = await supabase
        .from('posts')
        .update({
          content: updatedPost.content,
          location: updatedPost.location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedPost.id)

      if (postError) {
        console.error('Failed to update post:', postError)
        toast.error('Failed to update post')
        return
      }

      // Handle media updates if there are changes
      if (updatedPost.media) {
        // Get current media for comparison
        const { data: currentMedia } = await supabase
          .from('post_media')
          .select('*')
          .eq('post_id', updatedPost.id)

        const currentMediaIds = currentMedia?.map((m) => m.id) || []
        const updatedMediaIds = updatedPost.media.map((m) => m.id)

        // Delete removed media items
        const mediaToDelete = currentMediaIds.filter(
          (id) => !updatedMediaIds.includes(id),
        )
        if (mediaToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('post_media')
            .delete()
            .in('id', mediaToDelete)

          if (deleteError) {
            console.error('Failed to delete media:', deleteError)
            // Continue anyway, don't fail the whole operation
          }
        }

        // Update existing media items (in case metadata changed)
        for (const mediaItem of updatedPost.media) {
          if (currentMediaIds.includes(mediaItem.id)) {
            const { error: updateError } = await supabase
              .from('post_media')
              .update({
                url: mediaItem.url,
                type: mediaItem.type,
                thumbnail: mediaItem.thumbnail,
                duration: mediaItem.duration,
              })
              .eq('id', mediaItem.id)

            if (updateError) {
              console.error('Failed to update media item:', updateError)
              // Continue anyway
            }
          }
        }
      }

      // Update local state
      setLocalPost(updatedPost)
      setIsEditing(false)
      toast.success('Post updated successfully')
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    }
  }
  const PostActions = () => (
    <div className="flex flex-wrap items-center gap-4">
      {['❤️', '🔥', '😂'].map((emoji) => {
        const reaction = reactions.find((r) => r.emoji === emoji)
        const baseStyle = emojiStyles[emoji] || 'bg-muted text-muted-foreground'
        const activeStyle = reaction?.reactedByMe
          ? baseStyle
          : 'bg-zinc-200/10 text-zinc-400'

        return (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            onClick={() => handleReact(emoji)}
            className={`hover:scale-110 transition-transform p-2 rounded-full font-semibold ${activeStyle}`}
          >
            <span className="text-xl">{emoji}</span>
            <span className="ml-2 text-sm">{reaction?.count || 0}</span>
          </Button>
        )
      })}
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="card-elevated rounded-2xl p-6 opacity-75 pointer-events-none space-y-4">
        <div className="text-muted-foreground">
          Login to interact with posts
        </div>
        <AuthButtons action="interact with posts" />
      </div>
    )
  }

  return (
    <>
      <div
        className={`card-elevated rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
          !detailed ? 'cursor-pointer' : ''
        }`}
        onClick={() => !detailed && router.push(`/post/${post.id}`)}
      >
        <div className="flex gap-4">
          <Avatar className={`${detailed ? 'size-16' : 'size-14'}`}>
            <AvatarImage
              src={localPost.profiles?.avatar_url || '/placeholder.svg'}
            />
            <AvatarFallback>
              {(localPost.profiles?.display_name || '??')
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground flex gap-2 flex-wrap">
                <strong>{localPost.profiles?.display_name}</strong> · @
                {localPost.profiles?.username} · {timeAgo}
                {/* Show edited indicator if post was updated */}
                {localPost.updated_at &&
                  localPost.updated_at !== localPost.created_at && (
                    <span className="text-xs text-zinc-500">• edited</span>
                  )}
              </div>
              <PostActionsDropdown
                isOwner={localPost.profiles?.id === user?.id}
                onDelete={() => {
                  if (confirm('Delete this post?')) {
                    deletePost(localPost.id, router).then((success) => {
                      if (success) toast.success('Post deleted')
                      else toast.error('Failed to delete post')
                    })
                  }
                }}
                onEdit={() => setIsEditing(true)}
                onReport={() => console.log('Report Post')}
                onMute={() => console.log('Mute User')}
                onBlock={() => console.log('Block User')}
              />
            </div>

            <div
              className="mt-2 text-foreground"
              dangerouslySetInnerHTML={{
                __html: processContent(localPost.content || ''),
              }}
            />

            {localPost.media && localPost.media.length > 0 && (
              <div className="mt-3">
                {localPost.media[0].type === 'video' ? (
                  <VideoPlayer
                    media={normalizePostMediaToMediaItem(localPost.media)[0]}
                  />
                ) : (
                  <MediaGrid
                    media={normalizePostMediaToMediaItem(localPost.media)}
                  />
                )}
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <PostActions />
              <div className="flex items-center gap-3">
                <div className="flex gap-2 items-center">
                  <MessageCircle className="size-5" />
                  <span>0</span>
                </div>

                <Repeat2 className="size-5" />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {' '}
                    <Share className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Share this post by @{localPost.profiles?.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        post={localPost}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleEditPost}
      />
    </>
  )
}
