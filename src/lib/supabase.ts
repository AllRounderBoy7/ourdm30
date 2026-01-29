import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          online: boolean
          last_seen: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          online?: boolean
          last_seen?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          online?: boolean
          last_seen?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          created_by: string
          type: 'direct' | 'group'
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          type: 'direct' | 'group'
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          type?: 'direct' | 'group'
          name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          pinned: boolean
          muted: boolean
          last_read_at: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          pinned?: boolean
          muted?: boolean
          last_read_at?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          pinned?: boolean
          muted?: boolean
          last_read_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'image' | 'file' | 'voice' | 'video'
          media_url: string | null
          reply_to_id: string | null
          forwarded_from: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          message_type?: 'text' | 'image' | 'file' | 'voice' | 'video'
          media_url?: string | null
          reply_to_id?: string | null
          forwarded_from?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          message_type?: 'text' | 'image' | 'file' | 'voice' | 'video'
          media_url?: string | null
          reply_to_id?: string | null
          forwarded_from?: string | null
          updated_at?: string
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
        }
      }
      message_reads: {
        Row: {
          id: string
          message_id: string
          user_id: string
          read_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          read_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          read_at?: string
        }
      }
      typing_indicators: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          is_typing: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          is_typing: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          is_typing?: boolean
          updated_at?: string
        }
      }
    }
  }
}

