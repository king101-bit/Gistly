'use client'

import { useState, useEffect } from 'react'
import { TopNavbar } from '@/components/TopNavbar'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Smile, Calendar, X } from 'lucide-react'
import UserAvatar from '@/components/UserAvatar'
import { useUser } from '../../../context/UserContext'
import { MediaItem } from '../../../global'
import { toast } from 'sonner'
import { MediaGrid } from '@/components/MediaGrid'
import { MediaUploadDialog } from '@/components/MediaUploadDialog'
import { createClient } from '../../../utils/supabase/client'
import { uploadFilesToSupabase } from '@/lib/fileUpload'

export default function PostPage() {
  const user = useUser()
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [previewMedia, setPreviewMedia] = useState<MediaItem[]>([])
  const [postContent, setPostContent] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const maxChars = 280

  const nigerianCities = [
    { label: 'FCT Abuja' },
    { label: 'Abia' },
    { label: 'Adamawa' },
    { label: 'Akwa Ibom' },
    { label: 'Anambra' },
    { label: 'Bauchi' },
    { label: 'Bayelsa' },
    { label: 'Benue' },
    { label: 'Borno' },
    { label: 'Cross River' },
    { label: 'Delta' },
    { label: 'Ebonyi' },
    { label: 'Edo' },
    { label: 'Ekiti' },
    { label: 'Enugu' },
    { label: 'Gombe' },
    { label: 'Imo' },
    { label: 'Jigawa' },
    { label: 'Kaduna' },
    { label: 'Kano' },
    { label: 'Katsina' },
    { label: 'Kebbi' },
    { label: 'Kogi' },
    { label: 'Kwara' },
    { label: 'Lagos' },
    { label: 'Nasarawa' },
    { label: 'Niger' },
    { label: 'Ogun' },
    { label: 'Ondo' },
    { label: 'Osun' },
    { label: 'Oyo' },
    { label: 'Plateau' },
    { label: 'Rivers' },
    { label: 'Sokoto' },
    { label: 'Taraba' },
    { label: 'Yobe' },
    { label: 'Zamfara' },
  ]

  const handleSelectMedia = (files: File[]) => {
    setMediaFiles((prev) => [...prev, ...files]) // append new files to existing ones
  }
  // Generate previews for selected mediaFiles & clean up on unmount or files change
  useEffect(() => {
    function getMediaType(fileType: string): 'video' | 'image' {
      return fileType.startsWith('video') ? 'video' : 'image'
    }

    const newPreviews = mediaFiles.map((file, i) => ({
      id: `${file.name}-${i}`,
      type: getMediaType(file.type),
      url: URL.createObjectURL(file),
      alt: file.name,
    }))

    setPreviewMedia(newPreviews)

    return () => {
      newPreviews.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [mediaFiles])

  const processContent = (content: string) => {
    return content.replace(
      /#(\w+)/g,
      '<span class="hashtag-highlight">#$1</span>',
    )
  }

  const handlePost = async () => {
    if (!postContent.trim()) return

    const supabase = createClient()
    const bucket = 'post-media'

    try {
      // Upload files and get URLs
      const uploadedUrls = await uploadFilesToSupabase(
        mediaFiles,
        supabase,
        bucket,
      )
      // uploadedUrls is string[] of URLs

      // Insert the post first
      const postPayload = {
        content: postContent,
        location: selectedLocation,
        user_id: user?.id,
        created_at: new Date().toISOString(),
      }

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([postPayload])
        .select('id') // Return the inserted post's ID
        .single()

      if (postError || !postData) {
        console.error('Error inserting post:', postError)
        toast.error('Failed to create post.')
        return
      }

      const postId = postData.id

      // Prepare media rows for post_media table
      // You need to get extra info like type, alt, etc. from your mediaFiles
      // For simplicity, assuming all are images and no alt or duration
      const mediaRows = uploadedUrls.map((url, i) => ({
        post_id: postId,
        url,
        type: mediaFiles[i].type.startsWith('video') ? 'video' : 'image',
        alt: mediaFiles[i].name,
        thumbnail: null,
        duration: null,
      }))

      // Insert media entries
      const { error: mediaError } = await supabase
        .from('post_media')
        .insert(mediaRows)

      if (mediaError) {
        console.error('Error inserting media:', mediaError)
        toast.error('Failed to save post media.')
        return
      }

      // Success! Clear form
      setPostContent('')
      setSelectedLocation('')
      setMediaFiles([])
      setPreviewMedia([])
      setShowLocationPicker(false)

      toast.success('Post created successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload media. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-lg lg:max-w-2xl mx-auto fade-in">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl lg:text-2xl font-bold">Create Post</h1>
            <Button
              onClick={handlePost}
              className={`px-6 lg:px-8 py-2 lg:py-3 rounded-full font-bold text-base lg:text-lg transition-all duration-200 button-press ${
                postContent.trim()
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white glow-effect'
                  : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              }`}
              disabled={!postContent.trim()}
            >
              Post
            </Button>
          </div>

          <div className="card-elevated rounded-2xl p-6 mb-6">
            <div className="flex gap-4 mb-6">
              <UserAvatar className="size-14 ring-2 ring-emerald-500/20" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-3 font-medium">
                  Posting as @{user?.username}
                </div>
                <Textarea
                  placeholder="What's happening in Naija? 🇳🇬"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="bg-transparent border-none resize-none text-lg placeholder:text-muted-foreground focus-visible:ring-0 p-3 min-h-[120px] font-medium leading-relaxed"
                  maxLength={maxChars}
                />

                {selectedLocation && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-emerald-400/10 rounded-lg">
                    <MapPin className="size-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">
                      {selectedLocation}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLocation('')}
                      className="ml-auto p-1 h-auto text-emerald-400 hover:text-emerald-300"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex gap-4">
                <MediaUploadDialog onSelectMedia={handleSelectMedia} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-3 rounded-full button-press"
                >
                  <Smile className="size-5" />
                </Button>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLocationPicker(!showLocationPicker)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-3 rounded-full button-press"
                  >
                    <MapPin className="size-5" />
                  </Button>

                  {showLocationPicker && (
                    <div className="absolute top-full left-0 mt-2 w-48 card-elevated rounded-lg p-2 z-10">
                      <div className="max-h-48 overflow-y-auto">
                        {nigerianCities.map((city) => (
                          <button
                            key={city.label}
                            onClick={() => {
                              setSelectedLocation(city.label)
                              setShowLocationPicker(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800/50 rounded transition-colors"
                          >
                            {city.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 p-3 rounded-full button-press"
                >
                  <Calendar className="size-5" />
                </Button>
              </div>
              <div
                className={`text-sm font-medium ${
                  postContent.length > maxChars * 0.9
                    ? 'text-red-400'
                    : postContent.length > maxChars * 0.7
                      ? 'text-yellow-400'
                      : 'text-muted-foreground'
                }`}
              >
                {postContent.length}/{maxChars}
              </div>
            </div>
          </div>

          {postContent.trim() && (
            <div className="card-elevated rounded-2xl p-6 slide-up">
              <div className="text-sm text-muted-foreground mb-4 font-medium">
                Preview:
              </div>
              <div className="flex gap-4">
                <UserAvatar className="size-12 ring-2 ring-emerald-500/20" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-foreground">
                      {user?.display_name}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      @{user?.username}
                    </span>
                    <span className="text-muted-foreground text-sm">•</span>
                    {selectedLocation && (
                      <>
                        <span className="text-muted-foreground text-sm flex items-center gap-1">
                          <span>📍</span> {selectedLocation}
                        </span>
                        <span className="text-muted-foreground text-sm">•</span>
                      </>
                    )}
                    <span className="text-muted-foreground text-sm">now</span>
                  </div>
                  <div
                    className="text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: processContent(postContent),
                    }}
                  />
                  {previewMedia.length > 0 && (
                    <div className="mt-4">
                      <MediaGrid media={previewMedia} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomTabBar activeTab="post" />
    </div>
  )
}
