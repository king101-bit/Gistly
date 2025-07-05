'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation' // or 'next/router' if pages router
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Share, Bookmark } from 'lucide-react'
import PostCard from '@/components/post-card'
import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { createClient } from '../../../../utils/supabase/client'
import { CommentComposer } from '@/components/Comment-composer'
import { CommentType, Post } from '../../../../global'
import { CommentCard } from '@/components/Comment-card'
import { CommentThread } from '@/components/CommentThread'

export default function PostDetailPage() {
  const params = useParams()
  const postId = params?.id
  const supabase = createClient()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState<CommentType[]>([])

  useEffect(() => {
    if (!postId) return

    async function fetchPost() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(
            `
            *,
            profiles (
              id,
              display_name,
              username,
              avatar_url,
              location
            ),
            post_media (
              id,
              url,
              type,
              alt,
              thumbnail,
              duration
            )
          `,
          )
          .eq('id', postId)
          .single()

        if (error) throw error

        setPost(data)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError(String(err))
      } finally {
        setLoading(false)
      }
    }
    function buildCommentThread(flatComments: CommentType[]): CommentType[] {
      const map = new Map<number, CommentType>()
      const roots: CommentType[] = []

      flatComments.forEach((comment) => {
        map.set(comment.id, { ...comment, replies: [] })
      })

      map.forEach((comment) => {
        if (comment.parent_id) {
          const parent = map.get(comment.parent_id)
          if (parent) {
            parent.replies!.push(comment)
            comment.level = (parent.level || 0) + 1
          }
        } else {
          roots.push(comment)
        }
      })

      return roots
    }

    function computeRepliesCount(comments: CommentType[]): CommentType[] {
      const countMap: Record<number, number> = {}

      comments.forEach((c) => {
        if (c.parent_id != null) {
          countMap[c.parent_id] = (countMap[c.parent_id] || 0) + 1
        }
      })

      return comments.map((c) => ({
        ...c,
        replies_count: countMap[c.id] || 0,
      }))
    }

    async function fetchComments() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(
            `
            *,
            profiles (
              display_name,
              username,
              avatar_url,
              location
            ),
            comment_media(*)
          `,
          )
          .eq('post_id', postId)

        if (error) throw error

        const counted = computeRepliesCount(data || [])
        const threaded = buildCommentThread(counted)
        setComments(threaded)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError(String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
    fetchComments()
  }, [postId])

  if (loading) return <div className="p-4 text-center">Loading post...</div>
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>
  if (!post) return <div className="p-4 text-center">Post not found.</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Post</h1>
              <p className="text-sm text-muted-foreground">Thread</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
              >
                <Share className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
              >
                <Bookmark className="size-5" />
              </Button>
            </div>
          </div>

          {/* Main Post */}
          <div className="mb-6">
            <PostCard post={post} detailed={true} />
          </div>

          {/* Comment Composer */}
          <div className="mb-6">
            <CommentComposer
              postId={post.id}
              onNewComment={(newComment) =>
                setComments((prev) => [newComment, ...prev])
              }
            />
          </div>

          {/* Comments Section*/}
          <div className="space-y-4" id="comments">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                Comments ({comments.length})
              </h2>
              <div className="flex gap-2 text-sm">
                <button className="text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1">
                  Latest
                </button>
                <button className="text-muted-foreground hover:text-foreground pb-1">
                  Top
                </button>
              </div>
            </div>

            <CommentThread
              comments={comments}
              postId={post.id}
              maxDepth={Infinity}
            />

            <div className="text-center pt-4">
              <Button
                variant="ghost"
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
              >
                Load more comments
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomTabBar activeTab="home" />
    </div>
  )
}
