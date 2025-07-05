'use client'

import { useState, useRef } from 'react'
import { ImageIcon, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SupabaseClient } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { uploadFilesToSupabase } from '@/lib/fileUpload'
import { MediaItem } from '../../global'

interface MediaUploaderProps {
  supabase: SupabaseClient
  userId?: string
  onUploadSuccess: (mediaData: MediaItem[]) => void
}

export function MediaUploader({
  supabase,
  userId,
  onUploadSuccess,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    if (!userId) {
      toast.error('You must be logged in to upload media')
      return
    }

    setIsUploading(true)
    setPreviewUrls([])

    try {
      // Create preview URLs
      const previews = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      )
      setPreviewUrls(previews)

      // Upload files to Supabase storage
      const fileUrls = await uploadFilesToSupabase(
        Array.from(e.target.files),
        supabase,
        'comment-media',
      )

      // Construct media metadata only, don't insert into DB yet
      const mediaData: MediaItem[] = fileUrls.map((url) => ({
        id: crypto.randomUUID(),
        url,
        type: url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? 'image' : 'video', // or 'other' if needed
      }))

      onUploadSuccess(mediaData)
      toast.success('Media uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload media')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removePreview = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 p-2 rounded-full button-press"
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImageIcon className="size-4" />
        )}
      </Button>

      {previewUrls.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 bg-background p-2 rounded-lg shadow-lg z-10 w-64">
          <div className="grid grid-cols-2 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
