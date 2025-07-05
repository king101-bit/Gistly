'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CommentCard } from './Comment-card'
import { CommentComposer } from './Comment-composer'
import { CommentType } from '../../global'

interface CommentThreadProps {
  comments: CommentType[]
  postId: number
  maxDepth?: number
}

interface CommentWithRepliesProps {
  comment: CommentType
  postId: number
  level?: number
  maxDepth?: number
}

function CommentWithReplies({
  comment,
  postId,
  level = 0,
  maxDepth = 3,
}: CommentWithRepliesProps) {
  const [showReplies, setShowReplies] = useState(true)
  const [showReplyComposer, setShowReplyComposer] = useState(false)
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null)
  const [localComment, setLocalComment] = useState(comment)

  const hasReplies = localComment.replies && localComment.replies.length > 0
  const canNestDeeper = true
  const isNested = level > 0

  const handleReply = (targetComment: CommentType) => {
    setReplyingTo(targetComment)
    setShowReplyComposer(true)
  }

  const handleCancelReply = () => {
    setShowReplyComposer(false)
    setReplyingTo(null)
  }

  const getIndentationStyle = (currentLevel: number) => {
    if (currentLevel === 0) return {}

    return {
      marginLeft: `${Math.min(currentLevel * 20, 60)}px`,
      position: 'relative' as const,
    }
  }

  const getThreadLineStyle = (currentLevel: number) => {
    if (currentLevel === 0) return {}

    return {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '-10px',
        top: '0',
        bottom: '0',
        width: '2px',
        background:
          'linear-gradient(to bottom, rgb(34 197 94 / 0.3), transparent)',
        borderRadius: '1px',
      },
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Comment */}
      <div
        style={getIndentationStyle(level)}
        className={`relative ${isNested ? 'before:absolute before:left-[-10px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-emerald-500/30 before:to-transparent before:rounded-full' : ''}`}
      >
        <CommentCard
          comment={localComment}
          level={level}
          onReply={() => handleReply(localComment)}
          showingReplyComposer={
            showReplyComposer && replyingTo?.id === comment.id
          }
        />

        {/* Reply Composer */}
        {showReplyComposer && replyingTo?.id === comment.id && (
          <div className="mt-4">
            <CommentComposer
              postId={postId}
              parentId={localComment.id}
              replyingTo={{
                id: localComment.id,
                profiles: { username: localComment.profiles.username },
              }}
              placeholder={`Reply to @${replyingTo.profiles.username}...`}
              onCancel={handleCancelReply}
              onNewComment={(newReply) => {
                setLocalComment((prev) => ({
                  ...prev,
                  replies: [...(prev.replies || []), newReply],
                  replies_count: (prev.replies_count || 0) + 1,
                }))
                setShowReplyComposer(false)
                setReplyingTo(null)
              }}
              compact={isNested}
              level={level + 1}
            />
          </div>
        )}
      </div>

      {/* Replies Section */}
      {hasReplies && (
        <div className="space-y-4">
          {/* Toggle Replies Button */}
          {localComment.replies_count > 0 && (
            <div style={getIndentationStyle(level + 1)}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 p-2 rounded-full text-sm font-medium"
              >
                {showReplies ? (
                  <ChevronDown className="size-4 mr-1" />
                ) : (
                  <ChevronRight className="size-4 mr-1" />
                )}
                {showReplies ? 'Hide' : 'Show'} {comment.replies_count}{' '}
                {comment.replies_count === 1 ? 'reply' : 'replies'}
              </Button>
            </div>
          )}

          {/* Nested Replies */}
          {showReplies &&
            localComment.replies?.map((reply) => (
              <CommentWithReplies
                key={reply.id}
                comment={reply}
                postId={postId}
                level={level + 1}
                maxDepth={maxDepth}
              />
            ))}
        </div>
      )}

      {/* Max Depth Reached - Show "Continue Thread" Link */}
      {hasReplies && !canNestDeeper && (
        <div style={getIndentationStyle(level + 1)}>
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 p-2 rounded-full text-sm font-medium"
          >
            Continue this thread →
          </Button>
        </div>
      )}
    </div>
  )
}

export function CommentThread({
  comments,
  postId,
  maxDepth = 3,
}: CommentThreadProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentWithReplies
          key={comment.id}
          comment={comment}
          postId={postId}
          level={0}
          maxDepth={maxDepth}
        />
      ))}
    </div>
  )
}
