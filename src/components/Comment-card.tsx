'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, MoreHorizontal, Shield } from 'lucide-react'
import { MediaGrid } from './MediaGrid'
import { CommentCardProps } from '../../global'
import { formatShortRelativeTime } from '../../utils/formatDate'
import { ReactionGroup } from './ReactionGroup'
import { useUser } from '../../context/UserContext'
import { deleteComment, PostActionsDropdown } from './PostActionsDropdown'
import { toast } from 'sonner'

export function CommentCard({
  comment,
  level = 0,
  onReply,
  showingReplyComposer,
}: CommentCardProps) {
  const isNested = level > 0
  const cardSize = isNested ? 'compact' : 'normal'
  const user = useUser()

  const getCardStyle = () => {
    if (isNested) return 'bg-zinc-900/30 border border-zinc-800/30'
    return 'card-elevated'
  }

  const processContent = (content: string) => {
    return content
      .replace(
        /#(\w+)/g,
        '<span class="hashtag-highlight text-emerald-400">#$1</span>',
      )
      .replace(
        /@(\w+)/g,
        '<span class="mention-highlight text-blue-400 font-medium">@$1</span>',
      )
  }

  const profile = comment.profiles
  const displayName = profile.display_name || 'Anonymous'
  const avatarUrl = profile.avatar_url || '/placeholder.svg'

  return (
    <div
      className={`rounded-2xl p-4 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 ${getCardStyle()}`}
    >
      <div className="flex gap-3">
        <Avatar
          className={`${cardSize === 'compact' ? 'size-8' : 'size-10'} ring-2 ring-emerald-500/20 flex-shrink-0`}
        >
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm">
            {displayName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className={`font-bold text-foreground truncate ${cardSize === 'compact' ? 'text-sm' : ''}`}
                >
                  {displayName}
                </span>
                {/* Optional verified badge in future */}
              </div>
              <span
                className={`text-muted-foreground truncate ${cardSize === 'compact' ? 'text-xs' : 'text-sm'}`}
              >
                @{profile.username}
              </span>
              <span className="text-zinc-600 flex-shrink-0">•</span>
              <span
                className={`text-muted-foreground flex items-center gap-1 flex-shrink-0 ${cardSize === 'compact' ? 'text-xs' : 'text-sm'}`}
              >
                <span>📍</span> {profile.location}
              </span>
              <span className="text-zinc-600 flex-shrink-0">•</span>
              <span
                className={`text-muted-foreground flex-shrink-0 ${cardSize === 'compact' ? 'text-xs' : 'text-sm'}`}
              >
                {formatShortRelativeTime(comment.created_at)}
              </span>
            </div>
            <PostActionsDropdown
              isOwner={user?.id === comment.user_id}
              onEdit={() => console.log('Edit comment')}
              onDelete={async () => {
                const confirmed = confirm(
                  'Are you sure you want to delete this comment?',
                )
                if (!confirmed) return

                const success = await deleteComment(comment.id)
                if (success) {
                  toast('comment removed successfully')
                  window.location.reload()
                }
              }}
              onReport={() => console.log('Report comment')}
              onMute={() => console.log('Mute user')}
              onBlock={() => console.log('Block user')}
            />
          </div>

          <div
            className={`text-foreground mb-4 leading-relaxed break-words ${cardSize === 'compact' ? 'text-sm' : ''}`}
            dangerouslySetInnerHTML={{
              __html: processContent(comment.content),
            }}
          />

          {comment.comment_media?.length > 0 && (
            <MediaGrid media={comment.comment_media} />
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <ReactionGroup
                targetType="comment"
                targetId={comment.id}
                currentUserId={user?.id}
                initialReactions={[]}
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onReply}
              className={`text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10 p-1 rounded-full button-press ${
                showingReplyComposer ? 'text-emerald-400 bg-emerald-400/10' : ''
              }`}
            >
              <MessageCircle className="size-4" />
              <span className="text-xs ml-1 font-semibold">
                {comment.replies_count}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
