// User types
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'
export type TeacherStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface User {
  _id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface TeacherProfile {
  _id: string
  userId: string
  user?: User
  slug: string
  status: TeacherStatus
  firstName: string
  lastName: string
  image?: string
  coverImage?: string
  bio?: string
  tagline?: string
  subjects: string[]
  grades: string[]
  experience?: number
  experienceLevel?: string
  qualifications?: string[]
  location?: {
    city?: string
    state?: string
    country?: string
    address?: string
    coordinates?: { lat: number; lng: number }
  }
  contact?: {
    email?: string
    phone?: string
    whatsapp?: string
    website?: string
  }
  pricing?: {
    hourlyRate?: string
    monthlyFee?: string
    groupClassPrice?: string
  }
  languages?: string[]
  stats?: {
    totalStudents?: number
    totalClasses?: number
    averageAttendance?: number
  }
  // Contact options
  showEmail?: boolean
  showPhone?: boolean
  showWhatsAppButton?: boolean
  whatsappNumber?: string
  
  // Public website settings
  allowPublicAIChat?: boolean
  showSchedulePreview?: boolean
  showTestimonials?: boolean
  showClassFees?: boolean
  showLocation?: boolean
  showStudentCount?: boolean
  
  // Highlights
  highlights?: string[]
  
  // Website customization
  websiteConfig?: WebsiteConfig
  
  // Verification
  isVerified?: boolean
  verificationDocuments?: string[]
  rejectionReason?: string
  
  createdAt: string
  updatedAt: string
}

export interface StudentProfile {
  _id: string
  userId: string
  user?: User
  firstName?: string
  lastName?: string
  grade?: string
  school?: string
  dateOfBirth?: string
  phone?: string
  parentName?: string
  image?: string
  parentGuardianIdNo?: string
  parentPhone?: string
  parentContact?: string
  relationship?: string
  address?: string
  preferredSubjects?: string[]
  learningGoals?: string
  preferredTeachers?: string[]
  registeredWithTeacherAt?: string
  createdAt: string
  updatedAt: string
}

// Website customization types
export interface WebsiteTheme {
  primaryColor: string
  accentColor: string
  fontPairing: 'default' | 'modern' | 'classic' | 'elegant'
  customCSS?: string
}

export interface WebsiteSection {
  id: string
  type: string
  order: number
  visible: boolean
  config: Record<string, unknown>
}

export interface WebsiteCustomContent {
  hero?: {
    title?: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
  }
  about?: {
    heading?: string
    content?: string
  }
  [key: string]: Record<string, unknown> | undefined
}

export interface WebsiteSEO {
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogImage?: string
}

export interface WebsiteConfig {
  theme: WebsiteTheme
  sections: WebsiteSection[]
  customContent: WebsiteCustomContent
  seo: WebsiteSEO
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
  teacherSlug?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}
