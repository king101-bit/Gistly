'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, ImageIcon, MapPin, Smile, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { AuthButtons } from './AuthButtons'
import UserAvatar from './UserAvatar'
import { Button } from './ui/button'
import TextareaAutosize from 'react-textarea-autosize'
import { createClient } from '../../utils/supabase/client'
import { MediaItem } from '../../global'
import { uploadFilesToSupabase } from '@/lib/fileUpload'
import { MediaUploadDialog } from './MediaUploadDialog'
import { MediaGrid } from './MediaGrid'
import { toast } from 'sonner'

interface PostComposerProps {
  parentPostId?: number
  onSubmitted?: () => void
  showPreview?: boolean
  user: { id: string; username: string; display_name: string }
}

export default function PostComposer({
  parentPostId,
  onSubmitted,
  showPreview = false,
  user,
}: PostComposerProps) {
  const { isAuthenticated } = useAuth()
  const supabase = createClient()
  const maxChars = 280

  const [thread, setThread] = useState([{ content: '' }])
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [previewMedia, setPreviewMedia] = useState<MediaItem[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const isThread = thread.length > 1

  useEffect(() => {
    const newPreviews: MediaItem[] = mediaFiles.map((file, i) => ({
      id: `${file.name}-${i}`,
      type: file.type.startsWith('video')
        ? 'video'
        : ('image' as 'video' | 'image'),
      url: URL.createObjectURL(file),
      alt: file.name,
    }))

    setPreviewMedia(newPreviews)

    return () => newPreviews.forEach((item) => URL.revokeObjectURL(item.url))
  }, [mediaFiles])

  const handleAddPost = () => setThread([...thread, { content: '' }])

  const handleRemovePost = (index: number) => {
    setThread((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContentChange = (index: number, value: string) => {
    const updated = [...thread]
    updated[index].content = value
    setThread(updated)
  }

  const handleSelectMedia = (files: File[]) => {
    setMediaFiles((prev) => [...prev, ...files])
  }

  const handleSubmit = async () => {
    const validBlocks = thread.filter((block) => block.content.trim())
    if (!validBlocks.length) return

    try {
      let mainPostId: string | null = null

      const uploadedUrls = await uploadFilesToSupabase(
        mediaFiles,
        supabase,
        'post-media',
      )

      if (parentPostId) {
        const followUps = validBlocks.map((block, i) => ({
          content: block.content,
          thread_parent_id: parentPostId,
          thread_sequence: i,
        }))
        const { error } = await supabase.from('posts').insert(followUps)
        if (error) throw error
      } else {
        const { data: mainPost, error: mainError } = await supabase
          .from('posts')
          .insert({
            content: validBlocks[0].content,
            user_id: user.id,
            location: selectedLocation,
            thread_sequence: 0,
          })
          .select()
          .single()

        if (mainError || !mainPost) throw mainError
        mainPostId = mainPost.id

        if (isThread && validBlocks.length > 1) {
          const followUps = validBlocks.slice(1).map((block, i) => ({
            content: block.content,
            thread_parent_id: mainPostId,
            thread_sequence: i + 1,
          }))

          const { error: followUpError } = await supabase
            .from('posts')
            .insert(followUps)
          if (followUpError) throw followUpError
        }

        const mediaRows = uploadedUrls.map((url, i) => ({
          post_id: mainPostId,
          url,
          type: mediaFiles[i].type.startsWith('video') ? 'video' : 'image',
          alt: mediaFiles[i].name,
          thumbnail: null,
          duration: null,
        }))

        const { error: mediaError } = await supabase
          .from('post_media')
          .insert(mediaRows)
        if (mediaError) throw mediaError
      }

      setThread([{ content: '' }])
      setMediaFiles([])
      setPreviewMedia([])
      setSelectedLocation('')
      setShowLocationPicker(false)
      onSubmitted?.()
    } catch (err) {
      console.error('Error submitting post:', err)
      toast.error('Failed to post. Try again.')
    }
  }

  if (!isAuthenticated) {
    return <AuthButtons action="create posts" size="lg" />
  }

  return (
    <div className="card-elevated rounded-2xl p-6 mb-6">
      <div className="flex gap-4">
        <UserAvatar className="size-12 lg:size-14 ring-2 ring-emerald-500/20" />
        <div className="flex-1">
          {thread.map((block, index) => (
            <div key={index} className="mb-6">
              <TextareaAutosize
                value={block.content}
                onChange={(e) => handleContentChange(index, e.target.value)}
                placeholder={
                  index === 0
                    ? isThread
                      ? 'Start your thread...'
                      : 'Wetin dey sup?'
                    : `Continue the gist... (${index + 1})`
                }
                minRows={3}
                className="w-full bg-transparent border-none resize-none text-lg lg:text-xl placeholder:text-muted-foreground focus-visible:ring-0 p-3 font-medium leading-relaxed"
                maxLength={maxChars}
              />

              {isThread && index > 0 && (
                <div className="text-right mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePost(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  <MediaUploadDialog onSelectMedia={handleSelectMedia} />
                  <Button
                    variant="ghost"
                    className="text-yellow-400 p-2 rounded-full button-press"
                  >
                    <Smile className="size-5" />
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setShowLocationPicker(!showLocationPicker)}
                      className="text-blue-400 p-2 rounded-full button-press"
                    >
                      <MapPin className="size-5" />
                    </Button>
                    {showLocationPicker && (
                      <div className="absolute top-full left-0 mt-2 w-48 card-elevated rounded-lg p-2 z-10">
                        {[
                          'Abuja',
                          'Lagos',
                          'Kano',
                          'Port Harcourt',
                          'Enugu',
                        ].map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedLocation(city)
                              setShowLocationPicker(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800/50 rounded"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="text-purple-400 p-2 rounded-full button-press"
                  >
                    <Calendar className="size-5" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {block.content.length}/{maxChars}
                </div>
              </div>

              {selectedLocation && index === 0 && (
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
          ))}

          {isThread ? (
            <Button
              onClick={handleAddPost}
              variant="ghost"
              className="text-emerald-400 mb-4"
            >
              + Add another post
            </Button>
          ) : (
            <Button
              onClick={handleAddPost}
              variant="ghost"
              className="text-muted-foreground text-sm mb-4"
            >
              ➕ Turn into a thread
            </Button>
          )}

          <div className="flex justify-end pt-2 border-t border-border mt-4">
            <Button
              onClick={handleSubmit}
              disabled={!thread.some((b) => b.content.trim())}
              className="px-6 py-2 rounded-full font-bold transition-all duration-200 button-press bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white glow-effect"
            >
              {isThread ? 'Post Thread' : 'Post'}
            </Button>
          </div>
        </div>
      </div>

      {showPreview && thread[0].content.trim() && (
        <div className="mt-8 border-t border-border pt-6">
          <div className="text-sm text-muted-foreground mb-4 font-medium">
            Preview:
          </div>
          <div className="flex gap-4">
            <UserAvatar className="size-12 ring-2 ring-emerald-500/20" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-foreground">
                  {user.display_name}
                </span>
                <span className="text-muted-foreground text-sm">
                  @{user.username}
                </span>
                {selectedLocation && (
                  <>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                      <span>📍</span> {selectedLocation}
                    </span>
                  </>
                )}
                <span className="text-muted-foreground text-sm">• now</span>
              </div>
              <div className="text-foreground leading-relaxed">
                {thread[0].content}
              </div>
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
  )
}
