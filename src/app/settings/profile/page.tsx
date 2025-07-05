'use client'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import NigeriaStatesSelect from '@/components/NigerianStatesSelect'
import { TopNavbar } from '@/components/TopNavbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Camera, Save, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { createClient } from '../../../../utils/supabase/client'
import AvatarUploadDialog from '@/components/AvatarUploadDialog'
import { removeAvatar } from '@/lib/removeAvatar'
import { toast } from 'sonner'

export default function page() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  const [isRemoving, setIsRemoving] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    displayName: 'Your Name',
    username: 'your_username',
    bio: 'Software Engineer & Tech Enthusiast 🚀 Building the future from Lagos, Nigeria 🇳🇬 Passionate about African innovation and good jollof rice 😄',
    location: 'Lagos, Nigeria',
    website: 'yourwebsite.com',
    birthDate: '1995-03-15',
  })
  const [hasChanges, setHasChanges] = useState(false)
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [])
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }
  const handleSave = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User not found:', userError?.message)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        birth_date: formData.birthDate,
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating profile:', error.message)
    } else {
      console.log('Profile updated successfully')
      setHasChanges(false)
    }
  }

  const handleCancel = () => {
    setHasChanges(false)
  }
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Failed to get user:', userError?.message)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        return
      }

      if (data) {
        setAvatarUrl(data.avatar_url || null)
        setFormData({
          displayName: data.display_name || '',
          username: data.username || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          birthDate: data.birth_date || '',
        })
      }
    }

    fetchProfile()
  }, [])

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <TopNavbar />
        <main className="pt-20 pb-24 lg:max-w-2xl mx-auto fade-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 rounded-full button-press"
                >
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Edit Profile</h1>
                <p className="text-sm text-muted-foreground">
                  Update your profile information
                </p>
              </div>
            </div>
            {hasChanges && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white glow-effect"
                >
                  <Save className="size-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
          {/* Profile Picture Section */}
          <div className="card-elevated rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="size-24 ring-4 ring-emerald-500/30">
                  <AvatarImage src={avatarUrl ?? '/freaky_doggy.jpg'} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-2xl">
                    {formData.displayName
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Change your profile picture
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a new photo to represent yourself on NaijaConnect
                </p>
                <div className="flex gap-2">
                  {userId && <AvatarUploadDialog userId={userId} />}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    disabled={!userId || isRemoving}
                    onClick={async () => {
                      if (!userId) return

                      // Optimistically clear UI
                      const previousAvatar = avatarUrl
                      setFormData((prev) => ({ ...prev, avatar_url: null }))
                      setPreview(null)
                      setIsRemoving(true)

                      // Perform actual DB update
                      const { error } = await supabase
                        .from('profiles')
                        .update({ avatar_url: null })
                        .eq('id', userId)

                      if (error) {
                        // Rollback on error
                        setFormData((prev) => ({
                          ...prev,
                          avatar_url: previousAvatar,
                        }))
                        toast('Failed to remove avatar')
                      } else {
                        toast('Avatar removed')
                      }

                      setIsRemoving(false)
                    }}
                  >
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card-elevated rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Display Name
                </label>
                <Input
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange('displayName', e.target.value)
                  }
                  className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-400"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    @
                  </span>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange('username', e.target.value)
                    }
                    className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-400 pl-8"
                    placeholder="username"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your username must be unique and can only contain letters,
                  numbers, and underscores.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-400 min-h-[100px]"
                  placeholder="Tell people about yourself..."
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Location & Links */}
          <div className="card-elevated rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">
              Location & Links
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange('location', e.target.value)
                  }
                  className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-400"
                  placeholder="Where are you based?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-400"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Birth Date
                </label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange('birthDate', e.target.value)
                  }
                  className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-400"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your birth date is used to personalize your experience and is
                  not shown publicly.
                </p>
              </div>
            </div>
          </div>

          {/* Nigerian Context Section */}
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">
              Nigerian Context 🇳🇬
            </h2>
            <div className="space-y-4">
              <div>
                <NigeriaStatesSelect />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin'].map(
                    (lang) => (
                      <Button
                        key={lang}
                        variant="outline"
                        size="sm"
                        className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 bg-transparent"
                      >
                        {lang}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <BottomTabBar activeTab="profile" />
      </div>
    </>
  )
}
