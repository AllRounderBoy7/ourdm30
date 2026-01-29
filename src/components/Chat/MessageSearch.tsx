import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { cn } from '@/lib/utils'

export const MessageSearch: React.FC = () => {
  const { messages, currentConversation } = useChat()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  if (!currentConversation) return null

  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-lg",
                    "bg-gray-100 dark:bg-gray-700",
                    "border border-gray-300 dark:border-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                    "text-gray-900 dark:text-white"
                  )}
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {searchQuery ? (
                filteredMessages.length > 0 ? (
                  <div className="space-y-2">
                    {filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                        <p className="text-gray-900 dark:text-white">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No messages found
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Type to search messages...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

