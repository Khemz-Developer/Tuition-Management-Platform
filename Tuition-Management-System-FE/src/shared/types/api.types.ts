// API types
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  status?: string
  subject?: string
  grade?: string
  startDate?: string
  endDate?: string
  [key: string]: string | undefined
}

// Lead types
export interface Lead {
  _id: string
  teacherId: string
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  grade?: string
  subject?: string
  message?: string
  source: 'AI_CHAT' | 'CONTACT_FORM' | 'DIRECT'
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateLeadDto {
  teacherId: string
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  grade?: string
  subject?: string
  message?: string
  source?: Lead['source']
}

// Audit Log types
export interface AuditLog {
  _id: string
  adminId: string
  admin?: {
    _id: string
    name: string
    email: string
  }
  action: string
  targetType: 'USER' | 'TEACHER' | 'STUDENT' | 'CLASS' | 'SETTING'
  targetId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}
