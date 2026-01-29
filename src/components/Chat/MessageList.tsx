import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCheck, MoreVertical, Reply, Forward } from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import { formatMessageTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { MessageReactions } from './MessageReactions'

export const MessageList: React.FC = () => {
  const { messages, currentConversation, loadMoreMessages } = useChat()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    const { scrollTop } = messagesContainerRef.current
    if (scrollTop === 0) {
      loadMoreMessages()
    }
  }

  const isOwnMessage = (message: any) => message.sender_id === user?.id

  const getReadStatus = (message: any) => {
    if (!isOwnMessage(message)) return null
    const readBy = message.read_by || []
    const participants = currentConversation?.participants?.filter(
      (p: any) => p.user_id !== user?.id
    ) || []
    const allRead = participants.every((p: any) => readBy.includes(p.user_id))
    return allRead ? 'read' : 'sent'
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
    >
      {messages.map((message) => {
        const own = isOwnMessage(message)
        const readStatus = getReadStatus(message)

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex', own ? 'justify-end' : 'justify-start')}
          >
            <div className={cn('flex gap-2 max-w-[70%]', own && 'flex-row-reverse')}>
              {!own && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {message.sender?.avatar_url ? (
                    <img
                      src={message.sender.avatar_url}
                      alt={message.sender.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    message.sender?.full_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              )}

              <div className={cn('flex flex-col', own ? 'items-end' : 'items-start')}>
                {message.reply_to_id && (
                  <div className={cn(
                    'mb-1 px-3 py-2 rounded-lg text-sm',
                    'bg-gray-100 dark:bg-gray-700',
                    'border-l-2 border-primary-500'
                  )}>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Replying to message</p>
                  </div>
                )}

                <div className="relative group">
                  <div
                    className={cn(
                      'px-4 py-2 rounded-2xl break-words',
                      own
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md',
                      message.message_type === 'image' && 'p-0 overflow-hidden',
                      message.message_type === 'voice' && 'px-6 py-3'
                    )}
                  >
                    {message.message_type === 'image' && message.media_url ? (
                      <img
                        src={message.media_url}
                        alt={message.content}
                        className="max-w-full h-auto rounded-2xl"
                      />
                    ) : message.message_type === 'voice' && message.media_url ? (
                      <audio controls className="w-full">
                        <source src={message.media_url} type="audio/webm" />
                      </audio>
                    ) : message.message_type === 'file' && message.media_url ? (
                      <a
                        href={message.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:underline"
                      >
                        <span>{message.content}</span>
                      </a>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>

                  <div className={cn(
                    'flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400',
                    own ? 'justify-end' : 'justify-start'
                  )}>
                    <span>{formatMessageTime(message.created_at)}</span>
                    {own && (
                      <div className="flex items-center">
                        {readStatus === 'read' ? (
                          <CheckCheck className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {message.reactions && message.reactions.length > 0 && (
                    <MessageReactions reactions={message.reactions} />
                  )}

                  <div className={cn(
                    'absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity',
                    own ? 'left-0 -translate-x-full' : 'right-0 translate-x-full',
                    'flex gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg'
                  )}>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Forward className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

