import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Smile, Mic, X } from 'lucide-react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { useChat } from '@/context/ChatContext'
import { cn } from '@/lib/utils'
import { compressImage, MAX_FILE_SIZE } from '@/lib/utils'

export const MessageInput: React.FC = () => {
  const { sendMessage, sendFile, sendVoiceNote, setTyping, currentConversation } = useChat()
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const handleSend = async () => {
    if (!input.trim() && !isRecording) return

    try {
      await sendMessage(input.trim())
      setInput('')
      setTyping(false)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    } else {
      setTyping(true)
    }
  }

  const handleFileSelect = async (file: File) => {
    try {
      if (file.size > MAX_FILE_SIZE) {
        alert('File size exceeds 10MB limit')
        return
      }

      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file)
        await sendFile(compressed)
      } else {
        await sendFile(file)
      }
    } catch (error) {
      console.error('Error sending file:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    for (const file of files) {
      await handleFileSelect(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await sendVoiceNote(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInput(prev => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  if (!currentConversation) return null

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative p-4 border-t border-gray-200 dark:border-gray-700',
        'bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl',
        isDragging && 'bg-primary-50 dark:bg-primary-900/20'
      )}
    >
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-100/50 dark:bg-primary-900/30 backdrop-blur-sm z-10 rounded-lg">
          <p className="text-primary-600 dark:text-primary-400 font-semibold">
            Drop files here to send
          </p>
        </div>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 mb-2 z-20">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            files.forEach(handleFileSelect)
          }}
        />

        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (e.target.value.trim()) {
                setTyping(true)
              } else {
                setTyping(false)
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className={cn(
              'w-full px-4 py-3 pr-12 rounded-xl resize-none',
              'bg-white dark:bg-gray-700',
              'border border-gray-300 dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'text-gray-900 dark:text-white placeholder-gray-400',
              'max-h-32 overflow-y-auto'
            )}
            style={{
              height: 'auto',
              minHeight: '48px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`
            }}
          />
        </div>

        {isRecording ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={stopRecording}
            className="p-3 rounded-full bg-red-500 text-white"
          >
            <X className="w-5 h-5" />
          </motion.button>
        ) : (
          <>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {input.trim() ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="p-3 rounded-full bg-primary-500 text-white"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className="p-3 rounded-full bg-primary-500 text-white"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
            )}
          </>
        )}
      </div>

      {isRecording && (
        <div className="mt-2 text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-3 h-3 bg-red-500 rounded-full"
          />
          <span className="ml-2 text-sm text-red-500">Recording...</span>
        </div>
      )}
    </div>
  )
}

