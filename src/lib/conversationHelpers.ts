import { supabase } from './supabase'

export const createDirectConversation = async (userId1: string, userId2: string) => {
  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId1)
    .then(async (result) => {
      if (result.data) {
        const conversationIds = result.data.map((p: any) => p.conversation_id)
        const { data: convs } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .in('conversation_id', conversationIds)
          .eq('user_id', userId2)
        
        if (convs && convs.length > 0) {
          return convs[0].conversation_id
        }
      }
      return null
    })

  if (existing) {
    return existing
  }

  // Create new conversation
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert({
      created_by: userId1,
      type: 'direct',
    })
    .select()
    .single()

  if (convError || !conversation) {
    throw convError || new Error('Failed to create conversation')
  }

  // Add participants
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: conversation.id, user_id: userId1 },
      { conversation_id: conversation.id, user_id: userId2 },
    ])

  if (partError) {
    throw partError
  }

  return conversation.id
}

export const createGroupConversation = async (createdBy: string, name: string, userIds: string[]) => {
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert({
      created_by: createdBy,
      type: 'group',
      name,
    })
    .select()
    .single()

  if (convError || !conversation) {
    throw convError || new Error('Failed to create conversation')
  }

  const participants = userIds.map(userId => ({
    conversation_id: conversation.id,
    user_id: userId,
  }))

  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert(participants)

  if (partError) {
    throw partError
  }

  return conversation.id
}

