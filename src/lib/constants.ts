export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  VOICE: 'voice',
  VIDEO: 'video',
} as const

export const CONVERSATION_TYPES = {
  DIRECT: 'direct',
  GROUP: 'group',
} as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_VOICE_DURATION = 60 // 60 seconds

export const EMOJI_REACTIONS = ['❤️', '😂', '😮', '😢', '🙏', '👍', '👎', '🔥']

