// Updated interfaces
export interface UserProfile {
  id: string
  username: string
  display_name: string
  avatar_url: string
  bio?: string
  location?: string
  website?: string // Keep optional if not always needed
  birth_date?: string // Keep optional if not always needed
  verified?: boolean
  created_at: string // Now required
  is_following?: boolean
}

export interface FollowingUser {
  id: string
  username: string
  display_name: string
  avatar_url: string
  bio?: string
  location?: string
  verified?: boolean
  profile_created_at: string
  followed_at: string
}

export type RelationshipType = 'followers' | 'following'

// You might also want these related types:
export interface Relationship {
  follower_id: string
  followed_id: string
  created_at: string
}

export interface FollowStatus {
  isFollowing: boolean
  followsYou: boolean
}

export interface RelationshipsResponse {
  data: FollowingUser[]
  count: number
  hasMore: boolean
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  alt?: string
  duration?: string
  comment_id?: number
  user_id?: string
}

interface PostMedia {
  id: string
  url: string
  type: 'image' | 'video'
  alt?: string
  thumbnail?: string | null
  duration?: string | null
  post_id: number
}

interface Post {
  id: number
  user_id: string // or number depending on your schema
  content: string
  location?: string | null
  created_at: string
  fire_reactions: string
  laugh_reactions: string
  heart_reactions: string
  replies_count: number
  repost_count: number
  updated_at: string
  profiles: UserProfile
  media?: PostMedia[]
  comment: CommentType[]
}

export interface CommentType {
  id: number
  post_id: number
  user_id: string
  parent_id?: number | null
  content: string
  created_at: string

  fire_reactions: number
  laugh_reactions: number
  heart_reactions: number
  replies_count: number

  profiles: {
    display_name: string
    username: string
    avatar_url: string
    location?: string | null
  }

  comment_media: MediaItem[]

  replies?: CommentType[] // nested replies (threading)
  level?: number // UI nesting level
}

interface CommentCardProps {
  level?: number
  onReply?: () => void
  showingReplyComposer?: boolean
  comment: CommentType
  onDelete: (
    commentId: string,
    commentData?: Comment,
    isRollback?: boolean,
  ) => void
  deleteComment: (commentId: string) => Promise<boolean>
}

type Reaction = {
  emoji: string
  count: number
  reactedByMe: boolean
}
export interface ReactionGroupProps {
  targetType: 'post' | 'comment'
  targetId: string | number
  initialReactions: {
    emoji: string
    count: number
    reactedByMe: boolean
  }[]
  currentUserId: string
}

export interface ReactionGroup {
  emoji: string
  count: number
  reactedByMe: boolean
}
