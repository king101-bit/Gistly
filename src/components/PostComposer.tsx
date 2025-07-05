'use client'
import React, { useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Calendar, ImageIcon, MapPin, Smile } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { AuthButtons } from './AuthButtons'
import UserAvatar from './UserAvatar'

export default function PostComposer() {
  const { isAuthenticated } = useAuth()
  const [postContent, setPostContent] = useState('')
  const maxChars = 280

  if (!isAuthenticated) {
    return <AuthButtons action="create posts" size="lg" />
  }
  return (
    <>
      <div className="card-elevated rounded-2xl p-6 mb-6">
        <div className="flex gap-4">
          <UserAvatar className="size-12 lg:size-14 ring-2 ring-emerald-500/20" />
          <div className="flex-1">
            <Textarea
              placeholder="Wetin dey sup?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="bg-gray-200 border-none resize-none text-lg lg:text-xl placeholder:text-muted-foreground focus-visible:ring-0 p-3 min-h-[80px] lg:min-h-[100px] font-medium leading-relaxed"
              maxLength={maxChars}
            />
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 p-2 rounded-full button-press"
                >
                  <ImageIcon className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-2 rounded-full button-press"
                >
                  <Smile className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded-full button-press"
                >
                  <MapPin className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 p-2 rounded-full button-press"
                >
                  <Calendar className="size-5" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
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
                <Button
                  className={`px-6 py-2 rounded-full font-bold transition-all duration-200 button-press ${
                    postContent.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white glow-effect'
                      : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  }`}
                  disabled={!postContent.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
