// Updated interfaces
export interface UserProfile {
  id: string
  username: string
  display_name: string
  avatar_url: string
  bio?: string
  location?: string
  website?: string
  birth_date?: string
  verified?: boolean
  created_at: string
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

export interface FollowStatus {
  isFollowing: boolean
  followsYou: boolean
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
  user_id: string
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
  post_media?: PostMedia[]
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

  replies?: CommentType[]
  level?: number
}

interface CommentCardProps {
  level?: number
  onReply?: () => void
  showingReplyComposer?: boolean
  comment: CommentType
  onDelete?: (
    commentId: string,
    commentData?: Comment,
    isRollback?: boolean,
  ) => void
  deleteComment?: (commentId: string) => Promise<boolean>
}

interface Notification {
  id: string
  type: 'like' | 'reply' | 'follow' | 'mention' | 'repost'
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  timestamp: string
  unread: boolean
}

interface NotificationCardProps {
  notification: Notification
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
  currentUserId?: string
}

export interface ReactionGroup {
  emoji: string
  count: number
  reactedByMe: boolean
}
