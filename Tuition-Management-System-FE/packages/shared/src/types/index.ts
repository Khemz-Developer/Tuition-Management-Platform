// User Types
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isSuspended: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  teacherId?: string; // Optional: Link student to teacher during registration
  teacherSlug?: string; // Alternative: Use slug to find teacher
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Teacher Profile Types
export enum TeacherStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface TeacherProfile {
  _id: string;
  userId: string;
  status: TeacherStatus;
  slug: string;
  firstName: string;
  lastName: string;
  bio?: string;
  image?: string;
  subjects: string[];
  grades: string[];
  location?: string;
  phone?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// Student Profile Types
export interface StudentProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  grade: string;
  school?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  createdAt: string;
  updatedAt: string;
}

// Class Types
export enum ClassStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum ClassVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface Class {
  _id: string;
  teacherId: string;
  title: string;
  description?: string;
  subject: string;
  grade: string;
  fee?: number;
  capacity?: number;
  visibility: ClassVisibility;
  status: ClassStatus;
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment Types
export enum EnrollmentStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REMOVED = 'REMOVED',
}

export interface Enrollment {
  _id: string;
  classId: string;
  studentId: string;
  status: EnrollmentStatus;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Session Types
export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Session {
  _id: string;
  classId: string;
  startDateTime: string;
  endDateTime: string;
  recurrenceRule?: string;
  status: SessionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

export interface Attendance {
  _id: string;
  sessionId: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
  markedAt: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Content Types
export interface Unit {
  _id: string;
  classId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  _id: string;
  unitId: string;
  title: string;
  order: number;
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  type: 'text' | 'heading' | 'list' | 'embed' | 'code';
  content: string;
  order: number;
}

export enum MaterialType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  LINK = 'LINK',
  IMAGE = 'IMAGE',
}

export interface Material {
  _id: string;
  lessonId: string;
  type: MaterialType;
  url: string;
  title: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Messaging Types
export enum ConversationType {
  DIRECT = 'DIRECT',
  CLASS = 'CLASS',
}

export interface Conversation {
  _id: string;
  type: ConversationType;
  classId?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachments?: string[];
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  classId: string;
  title: string;
  body: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export enum NotificationType {
  ENROLLMENT_REQUEST = 'ENROLLMENT_REQUEST',
  ENROLLMENT_APPROVED = 'ENROLLMENT_APPROVED',
  ENROLLMENT_REJECTED = 'ENROLLMENT_REJECTED',
  SESSION_CREATED = 'SESSION_CREATED',
  SESSION_UPDATED = 'SESSION_UPDATED',
  SESSION_CANCELLED = 'SESSION_CANCELLED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_ANNOUNCEMENT = 'NEW_ANNOUNCEMENT',
  NEW_MATERIAL = 'NEW_MATERIAL',
  ATTENDANCE_MARKED = 'ATTENDANCE_MARKED',
}

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  payload: Record<string, any>;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AdminDashboardStats {
  totalTeachers: number;
  pendingTeachers: number;
  totalStudents: number;
  totalClasses: number;
  teacherStats: TeacherStats[];
}

export interface TeacherStats {
  teacherId: string;
  teacherName: string;
  subjects: string[];
  activeClasses: number;
  totalStudents: number;
  attendanceAverage: number;
}

export interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  upcomingSessions: number;
  unreadMessages: number;
  classStats: ClassStats[];
}

export interface ClassStats {
  classId: string;
  className: string;
  studentCount: number;
  attendancePercentage: number;
  upcomingSessions: number;
  unreadMessages: number;
  latestMaterials: number;
}

export interface StudentDashboardStats {
  enrolledClasses: number;
  upcomingSessions: number;
  newMaterials: number;
  unreadMessages: number;
}

// Website Customization Types
export interface WebsiteConfig {
  theme: {
    primaryColor: string;
    accentColor: string;
    fontPairing: 'default' | 'modern' | 'classic' | 'elegant';
    customCSS?: string;
  };
  sections: WebsiteSection[];
  customContent: Record<string, any>;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showWhatsAppButton: boolean;
    showSchedulePreview: boolean;
    showTestimonials: boolean;
    showClassFees: boolean;
    showLocation: boolean;
    showStudentCount: boolean;
    allowPublicAIChat: boolean;
  };
}

export interface WebsiteSection {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  config: Record<string, any>;
}

// Lead Types
export interface Lead {
  _id: string;
  teacherId: string;
  studentName: string;
  grade: string;
  contactMethod: 'email' | 'whatsapp' | 'phone';
  contactValue: string;
  preferredSubject?: string;
  message?: string;
  source: 'ai_chat' | 'contact_form';
  createdAt: string;
  updatedAt: string;
}

// Audit Log Types
export interface AdminAuditLog {
  _id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

// Request/Response DTOs
export interface CreateClassRequest {
  title: string;
  description?: string;
  subject: string;
  grade: string;
  fee?: number;
  capacity?: number;
  visibility: ClassVisibility;
  status: ClassStatus;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {}

export interface CreateSessionRequest {
  classId: string;
  startDateTime: string;
  endDateTime: string;
  recurrenceRule?: string;
}

export interface MarkAttendanceRequest {
  sessionId: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
}

export interface CreateEnrollmentRequest {
  classId: string;
}

export interface ApproveTeacherRequest {
  teacherId: string;
  reason?: string;
}

export interface RejectTeacherRequest {
  teacherId: string;
  reason: string;
}

export interface SendMessageRequest {
  conversationId?: string;
  classId?: string;
  recipientId?: string;
  text: string;
  attachments?: string[];
}

export interface CreateAnnouncementRequest {
  classId: string;
  title: string;
  body: string;
}

export interface CreateUnitRequest {
  classId: string;
  title: string;
  order: number;
}

export interface CreateLessonRequest {
  unitId: string;
  title: string;
  order: number;
  content: ContentBlock[];
}

export interface UploadMaterialRequest {
  lessonId: string;
  type: MaterialType;
  title: string;
  url: string;
  metadata?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
