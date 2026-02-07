// Session types
export interface Session {
  _id: string
  classId: string
  class?: {
    _id: string
    title: string
    subject: string
    grade: string
  }
  title?: string
  description?: string
  startDateTime: string
  endDateTime: string
  recurrenceRule?: string
  location?: string
  meetingLink?: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdBy: string
  attendanceMarked?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSessionDto {
  classId: string
  title?: string
  description?: string
  startDateTime: string
  endDateTime: string
  recurrenceRule?: string
  location?: string
  meetingLink?: string
}

export interface UpdateSessionDto extends Partial<CreateSessionDto> {
  status?: Session['status']
}
