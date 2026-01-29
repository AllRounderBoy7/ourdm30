import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export const useOnlineStatus = () => {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Set user as online
    const setOnline = async () => {
      await supabase
        .from('users')
        .update({ online: true, last_seen: new Date().toISOString() })
        .eq('id', user.id)
    }

    // Set user as offline
    const setOffline = async () => {
      await supabase
        .from('users')
        .update({ online: false, last_seen: new Date().toISOString() })
        .eq('id', user.id)
    }

    // Set online on mount
    setOnline()

    // Update last_seen periodically
    const interval = setInterval(() => {
      supabase
        .from('users')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', user.id)
        .then(() => {})
    }, 30000) // Every 30 seconds

    // Set offline on unmount
    const handleBeforeUnload = () => {
      setOffline()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      setOffline()
    }
  }, [user])
}

