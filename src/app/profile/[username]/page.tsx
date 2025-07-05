'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import FlexibleTabs from '@/components/FlexibleTabs'
import PostCard from '@/components/post-card'
import { TopNavbar } from '@/components/TopNavbar'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/UserAvatar'
import { Calendar, LinkIcon, MapPin, Pencil } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '../../../../context/UserContext'
import { createClient } from '../../../../utils/supabase/client'
import { Post, UserProfile } from '../../../../global'

export default function ProfilePage() {
  const { username } = useParams()
  const currentUser = useUser()
  const [currentTab, setCurrentTab] = useState('posts')
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ followers: 0, following: 0 })
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [youFollow, setYouFollow] = useState(false)
  const [loadingFollowStatus, setLoadingFollowStatus] = useState(true)
  const [togglingFollow, setTogglingFollow] = useState(false)

  const supabase = createClient()

  const handleFollowToggle = async () => {
    if (togglingFollow || !currentUser || !profileUser) return
    setTogglingFollow(true)
    try {
      if (youFollow) {
        await supabase
          .from('relationships')
          .delete()
          .match({ follower_id: currentUser.id, following_id: profileUser.id })
      } else {
        await supabase
          .from('relationships')
          .insert({ follower_id: currentUser.id, following_id: profileUser.id })
      }
      setYouFollow(!youFollow)
    } catch (err) {
      console.error('Failed to toggle follow:', err)
    } finally {
      setTogglingFollow(false)
    }
  }

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (
        !currentUser?.id ||
        !profileUser?.id ||
        currentUser.id === profileUser.id
      ) {
        setLoadingFollowStatus(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('relationships')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', profileUser.id)
          .maybeSingle()

        if (error && error.code !== 'PGRST116')
          console.error('Error checking follow status:', error)
        setYouFollow(!!data)
      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoadingFollowStatus(false)
      }
    }
    checkFollowStatus()
  }, [currentUser?.id, profileUser?.id])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single()
        if (userError) throw userError
        if (!userData) throw new Error('User not found')

        setProfileUser(userData)
        setIsCurrentUser(currentUser?.id === userData.id)

        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*, post_media(id, url, type, alt, thumbnail, duration)')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false })
        if (postsError) throw postsError

        const { count: followers } = await supabase
          .from('relationships')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', userData.id)

        const { count: following } = await supabase
          .from('relationships')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userData.id)

        setPosts(postsData || [])
        setStats({ followers: followers || 0, following: following || 0 })
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [username, currentUser?.id])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Joined recently'
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    }
    return `Joined ${new Date(dateString).toLocaleDateString(undefined, options)}`
  }

  const renderActionButton = () => {
    if (isCurrentUser) {
      return (
        <Link href="/settings/profile">
          <Button className="px-6 py-2 rounded-full font-bold bg-emerald-500 text-white hover:bg-emerald-600">
            <Pencil className="size-4 mr-2" /> Edit Profile
          </Button>
        </Link>
      )
    }
    if (!loadingFollowStatus) {
      return (
        <Button
          onClick={handleFollowToggle}
          disabled={togglingFollow}
          className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${
            youFollow
              ? 'bg-gray-400 hover:bg-gray-500'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
          }`}
        >
          {youFollow ? 'Following' : 'Follow'}
        </Button>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <Skeleton className="h-40 lg:h-64 w-full rounded-none" />
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">
              {error ? 'Error loading profile' : 'User not found'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {error || `The user @${username} doesn't exist`}
            </p>
            <Link href="/">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
        <BottomTabBar activeTab="profile" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />
      <main className="pt-16 pb-24 lg:pb-8">
        <div className="max-w-lg lg:max-w-4xl mx-auto">
          <div className="relative">
            <div className="h-40 lg:h-64 bg-gradient-to-br from-emerald-500 via-yellow-500 to-orange-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="absolute -bottom-16 lg:-bottom-20 left-6 lg:left-8">
              <UserAvatar
                className="size-32 lg:size-40 border-4 border-background ring-4 ring-emerald-500/30 shadow-lg"
                user={profileUser}
              />
            </div>
          </div>

          <div className="px-6 lg:px-8 mt-20 lg:mt-24">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-1">
                  {profileUser.display_name || 'Anonymous'}
                </h1>
                <p className="text-muted-foreground text-lg lg:text-xl">
                  @{profileUser.username}
                </p>
              </div>
              {renderActionButton()}
            </div>

            <p className="text-foreground mb-4 leading-relaxed text-lg lg:text-xl">
              {profileUser.bio || 'No bio yet. Tell people about yourself!'}
            </p>

            <div className="flex flex-wrap gap-4 lg:gap-6 text-sm lg:text-base text-muted-foreground">
              {profileUser.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 lg:size-5" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser.website && (
                <a
                  href={
                    profileUser.website.startsWith('http')
                      ? profileUser.website
                      : `https://${profileUser.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <LinkIcon className="size-4 lg:size-5" />
                  <span className="text-emerald-400 hover:underline">
                    {profileUser.website.replace(/^https?:\/\//, '')}
                  </span>
                </a>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="size-4 lg:size-5" />
                <span>{formatDate(profileUser.created_at)}</span>
              </div>
            </div>

            <div className="flex gap-8 mb-8 text-lg lg:text-xl">
              <Link
                href={`/profile/${profileUser.username}/following`}
                className="group"
              >
                <div className="cursor-pointer group-hover:text-emerald-400 transition-colors">
                  <span className="font-bold text-foreground">
                    {stats.following.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground ml-2">Following</span>
                </div>
              </Link>
              <Link
                href={`/profile/${profileUser.username}/followers`}
                className="group"
              >
                <div className="cursor-pointer group-hover:text-emerald-400 transition-colors">
                  <span className="font-bold text-foreground">
                    {stats.followers.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground ml-2">Followers</span>
                </div>
              </Link>
            </div>

            <FlexibleTabs
              tabs={['Posts', 'Replies', 'Media', 'Likes']}
              defaultTab="posts"
              onTabChange={setCurrentTab}
            />

            <div className="space-y-4">
              {currentTab === 'posts' && (
                <div className="mt-4 mb-4 gap-6">
                  {posts.length > 0 ? (
                    posts.map((post, index) => (
                      <div
                        key={post.id}
                        className="slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <PostCard post={post} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No posts yet
                      </p>
                      <p className="text-muted-foreground text-sm mt-2">
                        {isCurrentUser
                          ? "When you create posts, they'll show up here."
                          : `@${profileUser.username} hasn't posted anything yet`}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {currentTab === 'media' && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No media available
                  </p>
                </div>
              )}
              {currentTab === 'replies' && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No replies yet
                  </p>
                </div>
              )}
              {currentTab === 'likes' && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No likes yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomTabBar activeTab="profile" />
    </div>
  )
}
