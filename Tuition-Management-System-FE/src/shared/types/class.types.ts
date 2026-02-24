// Class types
export type ClassStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
export type ClassVisibility = 'PUBLIC' | 'PRIVATE'

export interface ScheduleRule {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:mm format
  endTime: string // HH:mm format
}

export interface Class {
  _id: string
  teacherId: string
  teacher?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  title: string
  description?: string
  subject: string
  grade: string
  fee?: number
  currency?: string
  capacity?: number
  enrolledCount?: number
  scheduleRules?: ScheduleRule[]
  visibility: ClassVisibility
  status: ClassStatus
  autoApproveEnrollment?: boolean
  startDate?: string
  endDate?: string
  tags?: string[]
  image?: string
  teachingMode?: string
  instituteName?: string
  address?: string
  studentTargetType?: string
  languages?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateClassDto {
  title: string
  description?: string
  subject: string
  grade: string
  fee?: number
  currency?: string
  capacity?: number
  scheduleRules?: ScheduleRule[]
  visibility?: ClassVisibility
  autoApproveEnrollment?: boolean
  startDate?: string
  endDate?: string
  tags?: string[]
  image?: string
  teachingMode?: string
  instituteName?: string
  address?: string
  studentTargetType?: string
  languages?: string[]
}

export interface UpdateClassDto extends Partial<CreateClassDto> {
  status?: ClassStatus
}
