'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { createClient } from '../../utils/supabase/client'
import { ReactionGroupProps } from '../../global'

export function ReactionGroup({
  targetType,
  targetId,
  initialReactions,
  currentUserId,
}: ReactionGroupProps) {
  const supabase = createClient()
  const [reactions, setReactions] = useState(initialReactions)

  const emojiStyles: Record<string, string> = {
    '❤️': 'bg-red-500/20 text-red-500',
    '🔥': 'bg-amber-500/20 text-amber-500',
    '😂': 'bg-yellow-300/20 text-yellow-500',
  }

  const handleToggle = async (emoji: string) => {
    const alreadyReacted = reactions.find(
      (r) => r.emoji === emoji && r.reactedByMe,
    )

    let newReactions = reactions.map((r) =>
      r.emoji === emoji
        ? {
            ...r,
            count: r.count + (alreadyReacted ? -1 : 1),
            reactedByMe: !alreadyReacted,
          }
        : r,
    )

    // Add new emoji if not already in the list
    if (!reactions.some((r) => r.emoji === emoji)) {
      newReactions.push({
        emoji,
        count: 1,
        reactedByMe: true,
      })
    }

    setReactions(newReactions)

    const { error } = alreadyReacted
      ? await supabase
          .from('reactions')
          .delete()
          .eq('user_id', currentUserId)
          .eq('target_type', targetType)
          .eq('target_id', targetId)
          .eq('emoji', emoji)
      : await supabase.from('reactions').insert([
          {
            user_id: currentUserId,
            target_type: targetType,
            target_id: targetId,
            emoji,
          },
        ])

    if (error) {
      console.error(error)
      setReactions(reactions) // Revert if error
    }
  }

  const availableEmojis = ['❤️', '🔥', '😂']

  return (
    <div className="flex gap-2">
      {availableEmojis.map((emoji) => {
        const reaction = reactions.find((r) => r.emoji === emoji)
        const baseStyle = emojiStyles[emoji] || 'bg-muted text-muted-foreground'
        const activeStyle = reaction?.reactedByMe
          ? baseStyle
          : 'bg-zinc-700/20 text-zinc-400'

        return (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            onClick={() => handleToggle(emoji)}
            className={`hover:scale-110 transition-transform p-2 rounded-full font-semibold ${activeStyle}`}
          >
            <span className="text-lg">{emoji}</span>
            <span className="ml-1 text-sm">{reaction?.count || 0}</span>
          </Button>
        )
      })}
    </div>
  )
}
