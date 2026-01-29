import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Pin, Volume2, VolumeX, Search } from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

export const ConversationList: React.FC = () => {
  const { conversations, currentConversation, setCurrentConversation } = useChat()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredConversations = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => {
      const aPinned = a.participants?.find(p => p.user_id === user?.id)?.pinned || false
      const bPinned = b.participants?.find(p => p.user_id === user?.id)?.pinned || false
      if (aPinned !== bPinned) return aPinned ? -1 : 1
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    if (!searchQuery) return sorted

    return sorted.filter(conv => {
      const name = conv.type === 'direct'
        ? conv.participants?.find(p => p.user_id !== user?.id)?.user?.full_name || ''
        : conv.name || ''
      return name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [conversations, searchQuery, user])

  const getConversationName = (conversation: any) => {
    if (conversation.type === 'group') {
      return conversation.name || 'Group Chat'
    }
    const otherParticipant = conversation.participants?.find(
      (p: any) => p.user_id !== user?.id
    )
    return otherParticipant?.user?.full_name || 'Unknown'
  }

  const getConversationAvatar = (conversation: any) => {
    if (conversation.avatar_url) return conversation.avatar_url
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants?.find(
        (p: any) => p.user_id !== user?.id
      )
      return otherParticipant?.user?.avatar_url || null
    }
    return null
  }

  const isOnline = (conversation: any) => {
    if (conversation.type === 'group') return false
    const otherParticipant = conversation.participants?.find(
      (p: any) => p.user_id !== user?.id
    )
    return otherParticipant?.user?.online || false
  }

  return (
    <div className="h-full flex flex-col bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-xl",
              "bg-white/50 dark:bg-gray-700/50",
              "border border-gray-300 dark:border-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              "text-gray-900 dark:text-white placeholder-gray-400"
            )}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.map((conversation) => {
          const isPinned = conversation.participants?.find(p => p.user_id === user?.id)?.pinned || false
          const isMuted = conversation.participants?.find(p => p.user_id === user?.id)?.muted || false
          const unreadCount = conversation.unread_count || 0

          return (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
              onClick={() => setCurrentConversation(conversation)}
              className={cn(
                "p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700",
                "transition-colors",
                currentConversation?.id === conversation.id && "bg-primary-50 dark:bg-primary-900/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {getConversationAvatar(conversation) ? (
                      <img
                        src={getConversationAvatar(conversation)}
                        alt={getConversationName(conversation)}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getConversationName(conversation).charAt(0).toUpperCase()
                    )}
                  </div>
                  {isOnline(conversation) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {getConversationName(conversation)}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatTime(conversation.updated_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPinned && <Pin className="w-4 h-4 text-primary-500" />}
                    {isMuted && <VolumeX className="w-4 h-4 text-gray-400" />}
                    {!isMuted && <Volume2 className="w-4 h-4 text-transparent" />}
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                      {conversation.last_message?.content || 'No messages yet'}
                    </p>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs font-semibold flex-shrink-0">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

