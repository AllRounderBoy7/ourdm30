import React from 'react'
import { motion } from 'framer-motion'
import { Phone, PhoneOff, Video } from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'

export const IncomingCall: React.FC = () => {
  const { callState, answerCall, rejectCall } = useChat()
  const { user } = useAuth()

  if (!callState.isCallIncoming) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Incoming {callState.callType === 'video' ? 'Video' : 'Voice'} Call
          </h2>
          <p className="text-gray-600 dark:text-gray-400">from User</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={rejectCall}
            className="p-4 rounded-full bg-red-500 text-white"
          >
            <PhoneOff className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={answerCall}
            className="p-4 rounded-full bg-green-500 text-white"
          >
            {callState.callType === 'video' ? (
              <Video className="w-6 h-6" />
            ) : (
              <Phone className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

