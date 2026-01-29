import React from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ChatProvider } from '@/context/ChatContext'
import { Login } from '@/components/Auth/Login'
import { Sidebar } from '@/components/Layout/Sidebar'
import { ChatView } from '@/components/Layout/ChatView'
import { CallScreen } from '@/components/Call/CallScreen'
import { IncomingCall } from '@/components/Call/IncomingCall'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  useOnlineStatus()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <ChatProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <ChatView />
        <CallScreen />
        <IncomingCall />
      </div>
    </ChatProvider>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

