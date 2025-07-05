'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Smile,
  ImageIcon,
  MapPin,
  Calendar,
  X,
  AlertCircle,
} from 'lucide-react'

import { MediaItem, Post, PostMedia } from '../../global'
import { VideoPlayer } from './VideoPlayer'
import { MediaGrid } from './MediaGrid'
import UserAvatar from './UserAvatar'

interface EditPostModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
  onSave: (updatedPost: Post) => void
}

export function EditPostModal({
  post,
  isOpen,
  onClose,
  onSave,
}: EditPostModalProps) {
  const [content, setContent] = useState(post.content)
  const [selectedLocation, setSelectedLocation] = useState(post.location || '')
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [media, setMedia] = useState<PostMedia[]>(post.media || [])
  const [isRemoving, setIsRemoving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const maxChars = 280

  // Nigerian cities for location picker
  const nigerianCities = [
    'Lagos',
    'Abuja',
    'Kano',
    'Ibadan',
    'Port Harcourt',
    'Benin City',
    'Kaduna',
    'Jos',
    'Ilorin',
    'Aba',
    'Onitsha',
    'Warri',
    'Calabar',
    'Enugu',
  ]

  useEffect(() => {
    if (isOpen) {
      setContent(post.content)
      setSelectedLocation(post.location || '')
      setMedia(post.media || [])
      setHasChanges(false)
    }
  }, [isOpen, post])

  // Check if there are any changes
  useEffect(() => {
    const contentChanged = content !== post.content
    const locationChanged = selectedLocation !== (post.location || '')
    const mediaChanged =
      JSON.stringify(media) !== JSON.stringify(post.media || [])

    setHasChanges(contentChanged || locationChanged || mediaChanged)
  }, [content, selectedLocation, media, post])

  const handleSave = () => {
    if (content.trim()) {
      onSave({
        ...post,
        content,
        location: selectedLocation,
        media,
      })
    }
  }

  const handleRemoveMedia = (mediaId: string) => {
    setIsRemoving(true)
    setTimeout(() => {
      setMedia(media.filter((item) => item.id !== mediaId))
      setIsRemoving(false)
    }, 300)
  }

  const processContent = (content: string) => {
    return content.replace(
      /#(\w+)/g,
      '<span class="hashtag-highlight">#$1</span>',
    )
  }

  // Helper function to convert PostMedia to MediaItem for components that expect MediaItem
  const convertToMediaItem = (postMedia: PostMedia): MediaItem => ({
    id: postMedia.id,
    type: postMedia.type,
    url: postMedia.url,
    thumbnail: postMedia.thumbnail || undefined, // Convert null to undefined
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400">Edit Post</span>
            {hasChanges && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Unsaved changes
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex gap-4">
            <UserAvatar className="size-12 ring-2 ring-emerald-500/20" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-white">
                  {post.profiles?.display_name}
                </span>
                {post.profiles?.verified && (
                  <span className="inline-flex items-center justify-center bg-blue-500 rounded-full size-4">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12L11 14L15 10"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
                <span className="text-zinc-400 text-sm">
                  @{post.profiles?.username}
                </span>
              </div>
              <Textarea
                placeholder="What's happening in Naija? 🇳🇬"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 resize-none text-lg placeholder:text-zinc-500 focus-visible:ring-emerald-500/50 min-h-[120px] font-medium leading-relaxed"
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

              {/* Media Preview */}
              {media && media.length > 0 && (
                <div className="mt-4 relative">
                  <div
                    className={`transition-opacity duration-300 ${isRemoving ? 'opacity-50' : 'opacity-100'}`}
                  >
                    {media[0].type === 'video' ? (
                      <div className="relative">
                        <VideoPlayer media={convertToMediaItem(media[0])} />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveMedia(media[0].id)}
                          className="absolute top-2 right-2 size-8 p-0 rounded-full"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <MediaGrid media={media.map(convertToMediaItem)} />
                        {media.map((item) => (
                          <Button
                            key={item.id}
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMedia(item.id)}
                            className="absolute top-2 right-2 size-8 p-0 rounded-full"
                          >
                            <X className="size-4" />
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 p-3 rounded-full"
              >
                <ImageIcon className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-3 rounded-full"
              >
                <Smile className="size-5" />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-3 rounded-full"
                >
                  <MapPin className="size-5" />
                </Button>

                {showLocationPicker && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg p-2 z-10">
                    <div className="max-h-48 overflow-y-auto">
                      {nigerianCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedLocation(city)
                            setShowLocationPicker(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 rounded transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 p-3 rounded-full"
              >
                <Calendar className="size-5" />
              </Button>
            </div>
            <div
              className={`text-sm font-medium ${
                content.length > maxChars * 0.9
                  ? 'text-red-400'
                  : content.length > maxChars * 0.7
                    ? 'text-yellow-400'
                    : 'text-zinc-400'
              }`}
            >
              {content.length}/{maxChars}
            </div>
          </div>

          {/* Preview */}
          {content.trim() && (
            <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
              <div className="text-sm text-zinc-400 mb-2 font-medium">
                Preview:
              </div>
              <div
                className="text-white leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processContent(content) }}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <div className="flex items-center text-sm text-zinc-400 gap-1 mr-2">
            <AlertCircle className="size-4" />
            <span>Edits will be visible to everyone</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim() || !hasChanges}
              className={`${
                content.trim() && hasChanges
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                  : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
