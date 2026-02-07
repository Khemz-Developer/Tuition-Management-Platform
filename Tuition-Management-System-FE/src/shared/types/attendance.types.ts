// Attendance types
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE'

export interface Attendance {
  _id: string
  sessionId: string
  session?: {
    _id: string
    startDateTime: string
    endDateTime: string
  }
  classId: string
  studentId: string
  student?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  status: AttendanceStatus
  notes?: string
  markedAt: string
  markedBy: string
  createdAt: string
  updatedAt: string
}

export interface MarkAttendanceDto {
  sessionId: string
  records: {
    studentId: string
    status: AttendanceStatus
    notes?: string
  }[]
}

export interface AttendanceSummary {
  studentId: string
  studentName: string
  totalSessions: number
  present: number
  absent: number
  late: number
  attendancePercentage: number
}
