'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Share, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function ShareMenu({
  postId,
  username,
}: {
  postId: number
  username: string
}) {
  const postUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${postId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(postUrl)
    toast('Link copied!')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Share className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuLabel>Share this post by @{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 pb-2 flex items-center justify-between space-x-2">
          <input
            type="text"
            readOnly
            value={postUrl}
            className="flex-1 text-sm bg-muted px-2 py-1 rounded-md border border-muted-foreground truncate"
          />
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="size-4 mr-1" />
            Copy
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
