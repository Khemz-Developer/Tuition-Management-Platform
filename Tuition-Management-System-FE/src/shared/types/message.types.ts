// Messaging types
export type ConversationType = 'DIRECT' | 'CLASS'

export interface Conversation {
  _id: string
  type: ConversationType
  classId?: string
  class?: {
    _id: string
    title: string
    subject: string
  }
  participants: {
    userId: string
    user?: {
      _id: string
      name: string
      email: string
      avatar?: string
    }
    joinedAt: string
    lastReadAt?: string
  }[]
  lastMessage?: Message
  unreadCount?: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  conversationId: string
  senderId: string
  sender?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  text?: string
  attachments?: MessageAttachment[]
  readBy: {
    userId: string
    readAt: string
  }[]
  isEdited?: boolean
  editedAt?: string
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

export interface MessageAttachment {
  type: 'image' | 'file' | 'video'
  url: string
  name?: string
  size?: number
  mimeType?: string
}

export interface SendMessageDto {
  conversationId: string
  text?: string
  attachments?: MessageAttachment[]
}

export interface CreateConversationDto {
  type: ConversationType
  participantIds?: string[]
  classId?: string
}

// Announcement types
export interface Announcement {
  _id: string
  classId: string
  class?: {
    _id: string
    title: string
  }
  title: string
  body: string
  attachments?: MessageAttachment[]
  isPinned?: boolean
  createdBy: string
  creator?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateAnnouncementDto {
  classId: string
  title: string
  body: string
  attachments?: MessageAttachment[]
  isPinned?: boolean
}
