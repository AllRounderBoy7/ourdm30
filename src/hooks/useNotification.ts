import { useEffect } from 'react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'

export const useNotification = () => {
  const { messages, currentConversation } = useChat()
  const { user } = useAuth()

  useEffect(() => {
    if (!('Notification' in window)) {
      return
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (!messages.length || !user || !currentConversation) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.sender_id === user.id) return

    if (document.hidden && Notification.permission === 'granted') {
      new Notification(`New message from ${lastMessage.sender?.full_name || 'Someone'}`, {
        body: lastMessage.content,
        icon: lastMessage.sender?.avatar_url || '/favicon.ico',
        tag: lastMessage.id,
      })
    }
  }, [messages, user, currentConversation])
}

