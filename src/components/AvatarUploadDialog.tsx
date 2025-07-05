'use client'
import React, { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner'
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

export default function AvatarUploadDialog({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]

    // ✅ Run checks first BEFORE setting file state
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      toast('Please upload a valid image')
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast('Image is too large (max 5MB)')
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}` // ✅ Put inside a folder (userId) to avoid conflicts

    // ✅ Clean upload call
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      toast('Upload failed: ' + uploadError.message)
      setLoading(false)
      return
    }

    // ✅ Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath)

    // ✅ Save to profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      toast('Failed to update profile: ' + updateError.message)
    } else {
      toast('Profile updated!')
    }

    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-400 text-emerald-400 bg-transparent"
        >
          Upload Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover mx-auto ring-2 ring-emerald-400"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              No image selected
            </div>
          )}
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
