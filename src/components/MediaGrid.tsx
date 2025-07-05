'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaItem } from '../../global'

interface MediaGridProps {
  media: MediaItem[]
  onRemove?: (id: string) => void
}

export function MediaGrid({ media, onRemove }: MediaGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const getGridLayout = (count: number) => {
    switch (count) {
      case 1:
        return 'grid-cols-1'
      case 2:
      case 3:
      case 4:
        return 'grid-cols-2'
      default:
        return 'grid-cols-2'
    }
  }

  const getImageLayout = (index: number, total: number) => {
    if (total === 1) return 'aspect-video'
    if (total === 2) return 'aspect-square'
    if (total === 3) {
      return index === 0 ? 'row-span-2 aspect-square' : 'aspect-square'
    }
    return 'aspect-square'
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const nextMedia = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % media.length)
    }
  }

  const prevMedia = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === 0 ? media.length - 1 : selectedIndex - 1,
      )
    }
  }

  return (
    <>
      <div
        className={`grid gap-2 ${getGridLayout(media.length)} rounded-2xl overflow-hidden`}
      >
        {media.slice(0, 4).map((item, index) => (
          <div
            key={item.id}
            className={`relative ${getImageLayout(index, media.length)} cursor-pointer group overflow-hidden bg-zinc-800`}
            onClick={() => openLightbox(index)}
          >
            {item.type === 'image' ? (
              <Image
                src={item.url || '/placeholder.svg'}
                alt={item.alt || `Media ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <video
                src={item.url}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            )}

            {/* Remove button */}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation() // prevent lightbox open
                  onRemove(item.id)
                }}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-md px-1 py-0.5 z-10"
              >
                ✕
              </button>
            )}

            {/* Overlay for more images */}
            {index === 3 && media.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  +{media.length - 4}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
            >
              <X className="size-6" />
            </Button>

            {/* Navigation Buttons */}
            {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
                >
                  <ChevronRight className="size-6" />
                </Button>
              </>
            )}

            {/* Display Image or Video */}
            <div className="relative w-full h-full flex items-center justify-center">
              {media[selectedIndex].type === 'image' ? (
                <Image
                  src={media[selectedIndex].url}
                  alt={media[selectedIndex].alt || `Media ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              ) : (
                <video
                  src={media[selectedIndex].url}
                  controls
                  autoPlay
                  className="max-h-full max-w-full rounded-lg"
                />
              )}
            </div>

            {/* Counter */}
            {media.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {media.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
