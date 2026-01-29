import React from 'react'
import { cn } from '@/lib/utils'

interface Reaction {
  id: string
  emoji: string
  user_id: string
}

interface MessageReactionsProps {
  reactions: Reaction[]
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions }) => {
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = []
    }
    acc[reaction.emoji].push(reaction)
    return acc
  }, {} as Record<string, Reaction[]>)

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, reacts]) => (
        <div
          key={emoji}
          className={cn(
            'px-2 py-1 rounded-full text-xs',
            'bg-white dark:bg-gray-700',
            'border border-gray-200 dark:border-gray-600',
            'flex items-center gap-1'
          )}
        >
          <span>{emoji}</span>
          <span className="text-gray-600 dark:text-gray-400">{reacts.length}</span>
        </div>
      ))}
    </div>
  )
}

