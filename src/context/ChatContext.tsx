import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { createPeerConnection, getMediaStream, stopMediaStream, CallState } from '@/lib/webrtc'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'voice' | 'video'
  media_url: string | null
  reply_to_id: string | null
  forwarded_from: string | null
  created_at: string
  sender?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  reactions?: Array<{
    id: string
    emoji: string
    user_id: string
  }>
  read_by?: string[]
}

interface Conversation {
  id: string
  created_by: string
  type: 'direct' | 'group'
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  participants?: Array<{
    id: string
    user_id: string
    pinned: boolean
    muted: boolean
    last_read_at: string | null
    user?: {
      id: string
      full_name: string
      avatar_url: string | null
      online: boolean
      last_seen: string
    }
  }>
  last_message?: Message
  unread_count?: number
}

interface TypingUser {
  user_id: string
  full_name: string
  is_typing: boolean
}

interface ChatContextType {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  typingUsers: TypingUser[]
  callState: CallState
  setCurrentConversation: (conversation: Conversation | null) => void
  sendMessage: (content: string, type?: Message['message_type'], mediaUrl?: string, replyToId?: string) => Promise<void>
  sendFile: (file: File) => Promise<void>
  sendVoiceNote: (audioBlob: Blob) => Promise<void>
  reactToMessage: (messageId: string, emoji: string) => Promise<void>
  markAsRead: (messageId: string) => Promise<void>
  setTyping: (isTyping: boolean) => void
  pinConversation: (conversationId: string, pinned: boolean) => Promise<void>
  muteConversation: (conversationId: string, muted: boolean) => Promise<void>
  startCall: (type: 'voice' | 'video') => Promise<void>
  endCall: () => void
  answerCall: () => Promise<void>
  rejectCall: () => void
  loadMoreMessages: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [callState, setCallState] = useState<CallState>({
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    callType: null,
    isCallActive: false,
    isCallIncoming: false,
    isCallOutgoing: false,
  })

  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map())
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversations
  useEffect(() => {
    if (!user) return

    const loadConversations = async () => {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          *,
          conversation:conversations(*),
          user:users(*)
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })

      if (error) {
        console.error('Error loading conversations:', error)
        return
      }

      const formattedConversations: Conversation[] = data.map((item: any) => ({
        ...item.conversation,
        participants: [item],
      }))

      setConversations(formattedConversations)
    }

    loadConversations()

    // Subscribe to conversation updates
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Load messages for current conversation
  useEffect(() => {
    if (!currentConversation || !user) return

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, full_name, avatar_url)
        `)
        .eq('conversation_id', currentConversation.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error loading messages:', error)
        return
      }

      const messagesWithReactions = await Promise.all(
        (data || []).map(async (msg: any) => {
          const { data: reactions } = await supabase
            .from('message_reactions')
            .select('*')
            .eq('message_id', msg.id)

          const { data: reads } = await supabase
            .from('message_reads')
            .select('user_id')
            .eq('message_id', msg.id)

          return {
            ...msg,
            reactions: reactions || [],
            read_by: reads?.map((r: any) => r.user_id) || [],
          }
        })
      )

      setMessages(messagesWithReactions.reverse())
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`,
        },
        async (payload) => {
          const newMessage = payload.new as any
          const { data: sender } = await supabase
            .from('users')
            .select('id, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single()

          const { data: reactions } = await supabase
            .from('message_reactions')
            .select('*')
            .eq('message_id', newMessage.id)

          const { data: reads } = await supabase
            .from('message_reads')
            .select('user_id')
            .eq('message_id', newMessage.id)

          setMessages(prev => [
            ...prev,
            {
              ...newMessage,
              sender,
              reactions: reactions || [],
              read_by: reads?.map((r: any) => r.user_id) || [],
            },
          ])

          // Mark as read if not sender
          if (newMessage.sender_id !== user.id) {
            markAsRead(newMessage.id)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=in.(${messages.map(m => m.id).join(',')})`,
        },
        () => {
          loadMessages()
        }
      )
      .subscribe()

    channelsRef.current.set(currentConversation.id, channel)

    return () => {
      const ch = channelsRef.current.get(currentConversation.id)
      if (ch) {
        supabase.removeChannel(ch)
        channelsRef.current.delete(currentConversation.id)
      }
    }
  }, [currentConversation, user])

  // Subscribe to typing indicators
  useEffect(() => {
    if (!currentConversation || !user) return

    const channel = supabase
      .channel(`typing:${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${currentConversation.id}`,
        },
        async (payload) => {
          const typing = payload.new as any
          if (typing.user_id === user.id) return

          const { data: typingUser } = await supabase
            .from('users')
            .select('id, full_name')
            .eq('id', typing.user_id)
            .single()

          if (typingUser) {
            setTypingUsers(prev => {
              const filtered = prev.filter(u => u.user_id !== typing.user_id)
              if (typing.is_typing) {
                return [...filtered, { ...typingUser, is_typing: true }]
              }
              return filtered
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentConversation, user])

  const sendMessage = useCallback(
    async (
      content: string,
      type: Message['message_type'] = 'text',
      mediaUrl?: string,
      replyToId?: string
    ) => {
      if (!currentConversation || !user || !content.trim()) return

      const { error } = await supabase.from('messages').insert({
        conversation_id: currentConversation.id,
        sender_id: user.id,
        content,
        message_type: type,
        media_url: mediaUrl || null,
        reply_to_id: replyToId || null,
      })

      if (error) {
        console.error('Error sending message:', error)
        throw error
      }

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversation.id)
    },
    [currentConversation, user]
  )

  const sendFile = useCallback(
    async (file: File) => {
      if (!currentConversation || !user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `conversations/${currentConversation.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(filePath)

      const isImage = file.type.startsWith('image/')
      await sendMessage(
        file.name,
        isImage ? 'image' : 'file',
        publicUrl
      )
    },
    [currentConversation, user, sendMessage]
  )

  const sendVoiceNote = useCallback(
    async (audioBlob: Blob) => {
      if (!currentConversation || !user) return

      const fileName = `${user.id}-${Date.now()}.webm`
      const filePath = `conversations/${currentConversation.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, audioBlob, {
          contentType: 'audio/webm',
        })

      if (uploadError) {
        console.error('Error uploading voice note:', uploadError)
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(filePath)

      await sendMessage('Voice note', 'voice', publicUrl)
    },
    [currentConversation, user, sendMessage]
  )

  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return

    const { data: existing } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      if (existing.emoji === emoji) {
        // Remove reaction
        await supabase.from('message_reactions').delete().eq('id', existing.id)
      } else {
        // Update reaction
        await supabase
          .from('message_reactions')
          .update({ emoji })
          .eq('id', existing.id)
      }
    } else {
      // Add reaction
      await supabase.from('message_reactions').insert({
        message_id: messageId,
        user_id: user.id,
        emoji,
      })
    }
  }, [user])

  const markAsRead = useCallback(async (messageId: string) => {
    if (!user) return

    const { data: existing } = await supabase
      .from('message_reads')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      await supabase.from('message_reads').insert({
        message_id: messageId,
        user_id: user.id,
        read_at: new Date().toISOString(),
      })
    }
  }, [user])

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!currentConversation || !user) return

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      await supabase.from('typing_indicators').upsert({
        conversation_id: currentConversation.id,
        user_id: user.id,
        is_typing: isTyping,
        updated_at: new Date().toISOString(),
      })

      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false)
        }, 3000)
      }
    },
    [currentConversation, user]
  )

  const pinConversation = useCallback(
    async (conversationId: string, pinned: boolean) => {
      if (!user) return

      await supabase
        .from('conversation_participants')
        .update({ pinned })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
    },
    [user]
  )

  const muteConversation = useCallback(
    async (conversationId: string, muted: boolean) => {
      if (!user) return

      await supabase
        .from('conversation_participants')
        .update({ muted })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
    },
    [user]
  )

  const startCall = useCallback(async (type: 'voice' | 'video') => {
    if (!currentConversation || !user) return

    try {
      const stream = await getMediaStream(type === 'video', true)
      const peerConnection = createPeerConnection()

      setCallState({
        localStream: stream,
        remoteStream: null,
        peerConnection,
        callType: type,
        isCallActive: false,
        isCallIncoming: false,
        isCallOutgoing: true,
      })

      // TODO: Implement WebRTC signaling via Supabase Realtime
    } catch (error) {
      console.error('Error starting call:', error)
    }
  }, [currentConversation, user])

  const endCall = useCallback(() => {
    stopMediaStream(callState.localStream)
    stopMediaStream(callState.remoteStream)
    callState.peerConnection?.close()

    setCallState({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      callType: null,
      isCallActive: false,
      isCallIncoming: false,
      isCallOutgoing: false,
    })
  }, [callState])

  const answerCall = useCallback(async () => {
    if (!callState.callType) return

    try {
      const stream = await getMediaStream(callState.callType === 'video', true)
      setCallState(prev => ({
        ...prev,
        localStream: stream,
        isCallActive: true,
        isCallIncoming: false,
      }))
    } catch (error) {
      console.error('Error answering call:', error)
    }
  }, [callState.callType])

  const rejectCall = useCallback(() => {
    endCall()
  }, [endCall])

  const loadMoreMessages = useCallback(async () => {
    if (!currentConversation || messages.length === 0) return

    const oldestMessage = messages[0]
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, full_name, avatar_url)
      `)
      .eq('conversation_id', currentConversation.id)
      .lt('created_at', oldestMessage.created_at)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) return

    const messagesWithReactions = await Promise.all(
      data.map(async (msg: any) => {
        const { data: reactions } = await supabase
          .from('message_reactions')
          .select('*')
          .eq('message_id', msg.id)

        const { data: reads } = await supabase
          .from('message_reads')
          .select('user_id')
          .eq('message_id', msg.id)

        return {
          ...msg,
          reactions: reactions || [],
          read_by: reads?.map((r: any) => r.user_id) || [],
        }
      })
    )

    setMessages(prev => [...messagesWithReactions.reverse(), ...prev])
  }, [currentConversation, messages])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        typingUsers,
        callState,
        setCurrentConversation,
        sendMessage,
        sendFile,
        sendVoiceNote,
        reactToMessage,
        markAsRead,
        setTyping,
        pinConversation,
        muteConversation,
        startCall,
        endCall,
        answerCall,
        rejectCall,
        loadMoreMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}

