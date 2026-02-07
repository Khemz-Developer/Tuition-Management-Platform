// Enrollment types
export type EnrollmentStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'REMOVED'

export interface Enrollment {
  _id: string
  classId: string
  class?: {
    _id: string
    title: string
    subject: string
    grade: string
    teacherId: string
    teacher?: {
      _id: string
      name: string
      email: string
    }
  }
  studentId: string
  student?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  status: EnrollmentStatus
  requestMessage?: string
  rejectionReason?: string
  joinedAt?: string
  createdAt: string
  updatedAt: string
}

export interface EnrollmentRequest {
  classId: string
  message?: string
}

export interface EnrollmentAction {
  enrollmentId: string
  action: 'approve' | 'reject'
  reason?: string
}
