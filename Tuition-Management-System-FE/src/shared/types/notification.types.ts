// Notification types
export type NotificationType = 
  | 'ENROLLMENT_REQUEST'
  | 'ENROLLMENT_APPROVED'
  | 'ENROLLMENT_REJECTED'
  | 'NEW_MESSAGE'
  | 'NEW_ANNOUNCEMENT'
  | 'SESSION_CREATED'
  | 'SESSION_UPDATED'
  | 'SESSION_CANCELLED'
  | 'SESSION_REMINDER'
  | 'ATTENDANCE_MARKED'
  | 'NEW_MATERIAL'
  | 'TEACHER_APPROVED'
  | 'TEACHER_REJECTED'
  | 'NEW_LEAD'
  | 'SYSTEM'

export interface Notification {
  _id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  payload?: {
    classId?: string
    sessionId?: string
    conversationId?: string
    enrollmentId?: string
    leadId?: string
    [key: string]: unknown
  }
  link?: string
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationPreferences {
  email: {
    enabled: boolean
    enrollmentRequests?: boolean
    newMessages?: boolean
    sessionReminders?: boolean
    announcements?: boolean
  }
  push: {
    enabled: boolean
    enrollmentRequests?: boolean
    newMessages?: boolean
    sessionReminders?: boolean
    announcements?: boolean
  }
  inApp: {
    enabled: boolean
  }
}
