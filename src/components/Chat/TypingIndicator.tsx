import React from 'react'
import { motion } from 'framer-motion'
import { useChat } from '@/context/ChatContext'

export const TypingIndicator: React.FC = () => {
  const { typingUsers } = useChat()

  if (typingUsers.length === 0) return null

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>
          {typingUsers.map(u => u.full_name).join(', ')}
          {typingUsers.length === 1 ? ' is' : ' are'} typing
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

