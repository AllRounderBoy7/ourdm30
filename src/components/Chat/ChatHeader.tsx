import React from 'react'
import { Phone, Video, MoreVertical, Pin, VolumeX } from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export const ChatHeader: React.FC = () => {
  const { currentConversation, startCall, pinConversation, muteConversation } = useChat()
  const { user } = useAuth()
  const [showMenu, setShowMenu] = React.useState(false)

  if (!currentConversation) return null

  const isPinned = currentConversation.participants?.find(p => p.user_id === user?.id)?.pinned || false
  const isMuted = currentConversation.participants?.find(p => p.user_id === user?.id)?.muted || false

  const getConversationName = () => {
    if (currentConversation.type === 'group') {
      return currentConversation.name || 'Group Chat'
    }
    const otherParticipant = currentConversation.participants?.find(
      (p: any) => p.user_id !== user?.id
    )
    return otherParticipant?.user?.full_name || 'Unknown'
  }

  const getConversationAvatar = () => {
    if (currentConversation.avatar_url) return currentConversation.avatar_url
    if (currentConversation.type === 'direct') {
      const otherParticipant = currentConversation.participants?.find(
        (p: any) => p.user_id !== user?.id
      )
      return otherParticipant?.user?.avatar_url || null
    }
    return null
  }

  const isOnline = () => {
    if (currentConversation.type === 'group') return false
    const otherParticipant = currentConversation.participants?.find(
      (p: any) => p.user_id !== user?.id
    )
    return otherParticipant?.user?.online || false
  }

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
            {getConversationAvatar() ? (
              <img
                src={getConversationAvatar()}
                alt={getConversationName()}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getConversationName().charAt(0).toUpperCase()
            )}
          </div>
          {isOnline() && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{getConversationName()}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isOnline() ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => startCall('voice')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={() => startCall('video')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
              <button
                onClick={() => {
                  pinConversation(currentConversation.id, !isPinned)
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Pin className={cn('w-4 h-4', isPinned && 'text-primary-500')} />
                <span>{isPinned ? 'Unpin' : 'Pin'} Chat</span>
              </button>
              <button
                onClick={() => {
                  muteConversation(currentConversation.id, !isMuted)
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <VolumeX className={cn('w-4 h-4', isMuted && 'text-primary-500')} />
                <span>{isMuted ? 'Unmute' : 'Mute'} Notifications</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

