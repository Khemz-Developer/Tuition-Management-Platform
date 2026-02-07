import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  
  // Admin
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    teachers: (filters?: Record<string, unknown>) => ['admin', 'teachers', filters] as const,
    teacher: (id: string) => ['admin', 'teacher', id] as const,
    students: (filters?: Record<string, unknown>) => ['admin', 'students', filters] as const,
    student: (id: string) => ['admin', 'student', id] as const,
    classes: (filters?: Record<string, unknown>) => ['admin', 'classes', filters] as const,
    auditLogs: (filters?: Record<string, unknown>) => ['admin', 'auditLogs', filters] as const,
  },
  
  // Teacher
  teacher: {
    profile: ['teacher', 'profile'] as const,
    dashboard: ['teacher', 'dashboard'] as const,
    classes: (filters?: Record<string, unknown>) => ['teacher', 'classes', filters] as const,
    class: (id: string) => ['teacher', 'class', id] as const,
    classStudents: (classId: string) => ['teacher', 'class', classId, 'students'] as const,
    sessions: (filters?: Record<string, unknown>) => ['teacher', 'sessions', filters] as const,
    session: (id: string) => ['teacher', 'session', id] as const,
    attendance: (sessionId: string) => ['teacher', 'attendance', sessionId] as const,
    content: (classId: string) => ['teacher', 'content', classId] as const,
    leads: (filters?: Record<string, unknown>) => ['teacher', 'leads', filters] as const,
    website: ['teacher', 'website'] as const,
  },
  
  // Student
  student: {
    profile: ['student', 'profile'] as const,
    dashboard: ['student', 'dashboard'] as const,
    classes: (filters?: Record<string, unknown>) => ['student', 'classes', filters] as const,
    class: (id: string) => ['student', 'class', id] as const,
    myClasses: ['student', 'myClasses'] as const,
    myClass: (id: string) => ['student', 'myClass', id] as const,
    enrollments: ['student', 'enrollments'] as const,
    sessions: (filters?: Record<string, unknown>) => ['student', 'sessions', filters] as const,
    attendance: (classId?: string) => ['student', 'attendance', classId] as const,
    content: (classId: string) => ['student', 'content', classId] as const,
  },
  
  // Public
  public: {
    teachers: (filters?: Record<string, unknown>) => ['public', 'teachers', filters] as const,
    teacher: (slug: string) => ['public', 'teacher', slug] as const,
  },
  
  // Messaging
  messaging: {
    conversations: ['messaging', 'conversations'] as const,
    conversation: (id: string) => ['messaging', 'conversation', id] as const,
    messages: (conversationId: string) => ['messaging', 'messages', conversationId] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unread: ['notifications', 'unread'] as const,
  },
}
