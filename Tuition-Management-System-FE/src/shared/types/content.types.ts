// Content types (Units, Lessons, Materials)
export interface Unit {
  _id: string
  classId: string
  title: string
  description?: string
  order: number
  lessons?: Lesson[]
  isPublished?: boolean
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  _id: string
  unitId: string
  title: string
  description?: string
  order: number
  content?: ContentBlock[]
  materials?: Material[]
  duration?: number // in minutes
  isPublished?: boolean
  createdAt: string
  updatedAt: string
}

export interface ContentBlock {
  id: string
  type: 'text' | 'heading' | 'list' | 'code' | 'embed' | 'image'
  content: string
  metadata?: Record<string, unknown>
}

export type MaterialType = 'PDF' | 'VIDEO' | 'LINK' | 'IMAGE' | 'DOCUMENT'

export interface Material {
  _id: string
  lessonId: string
  title: string
  description?: string
  type: MaterialType
  url: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  duration?: number // for videos, in seconds
  thumbnail?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateUnitDto {
  classId: string
  title: string
  description?: string
  order?: number
}

export interface CreateLessonDto {
  unitId: string
  title: string
  description?: string
  order?: number
  content?: ContentBlock[]
}

export interface CreateMaterialDto {
  lessonId: string
  title: string
  description?: string
  type: MaterialType
  url: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  duration?: number
  thumbnail?: string
}
