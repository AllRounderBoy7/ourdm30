import React from 'react'
import { useChat } from '@/context/ChatContext'
import { ChatHeader } from '@/components/Chat/ChatHeader'
import { MessageList } from '@/components/Chat/MessageList'
import { MessageInput } from '@/components/Chat/MessageInput'
import { TypingIndicator } from '@/components/Chat/TypingIndicator'

export const ChatView: React.FC = () => {
  const { currentConversation } = useChat()

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Select a conversation
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList />
        <TypingIndicator />
        <MessageInput />
      </div>
    </div>
  )
}

