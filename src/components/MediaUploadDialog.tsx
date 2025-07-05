'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MediaGrid } from './MediaGrid' // your existing component
import { ImageIcon } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  alt?: string
  duration?: string
}

interface MediaUploadDialogProps {
  onSelectMedia: (files: File[]) => void
}

export function MediaUploadDialog({ onSelectMedia }: MediaUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const arrFiles = Array.from(files)
    setSelectedFiles(arrFiles)
  }

  const onConfirm = () => {
    onSelectMedia(selectedFiles)
    setSelectedFiles([])
  }

  function getMediaType(fileType: string): 'video' | 'image' {
    return fileType.startsWith('video') ? 'video' : 'image'
  }

  const previewMedia: MediaItem[] = selectedFiles.map((file, i) => ({
    id: `${file.name}-${i}`,
    type: getMediaType(file.type),
    url: URL.createObjectURL(file),
  }))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 p-3 rounded-full button-press"
        >
          <ImageIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>

        <Input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        {previewMedia.length > 0 && (
          <div className="mt-4">
            <MediaGrid media={previewMedia} />
          </div>
        )}

        <DialogFooter>
          <Button disabled={selectedFiles.length === 0} onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
