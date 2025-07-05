'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  alt?: string
  duration?: string
}

interface VideoPlayerProps {
  media: MediaItem
}

export function VideoPlayer({ media }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div
      className="relative aspect-video rounded-2xl overflow-hidden bg-black group cursor-pointer"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={media.thumbnail}
        muted={isMuted}
        loop
        playsInline
      >
        <source src={media.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full p-4 size-16"
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
          >
            {isPlaying ? (
              <Pause className="size-8" />
            ) : (
              <Play className="size-8 ml-1" />
            )}
          </Button>
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen()
            }}
          >
            <Maximize className="size-4" />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
            >
              {isMuted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </Button>
          </div>

          {/* Duration */}
          {media.duration && (
            <div className="text-white text-sm bg-black/60 px-2 py-1 rounded">
              {media.duration}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
