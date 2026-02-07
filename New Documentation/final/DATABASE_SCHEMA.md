# Database Schema - MongoDB Models

## Index

1. [User](#user)
2. [TeacherProfile](#teacherprofile)
3. [StudentProfile](#studentprofile)
4. [Class](#class)
5. [Enrollment](#enrollment)
6. [Session](#session)
7. [Attendance](#attendance)
8. [Unit](#unit)
9. [Lesson](#lesson)
10. [Material](#material)
11. [Conversation](#conversation)
12. [Message](#message)
13. [Announcement](#announcement)
14. [Notification](#notification)
15. [AdminAuditLog](#adminauditlog)
16. [Lead](#lead)

---

## User

Base user model for authentication and role management.

```typescript
{
  _id: ObjectId
  email: string (required, unique, indexed, lowercase)
  password: string (required, hashed with bcrypt)
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' (required, indexed)
  isActive: boolean (default: true)
  isSuspended: boolean (default: false)
  suspendedAt: Date (optional)
  suspendedBy: ObjectId (ref: User, optional)
  suspensionReason: string (optional)
  lastLoginAt: Date (optional)
  emailVerified: boolean (default: false)
  emailVerifiedAt: Date (optional)
  resetPasswordToken: string (optional, indexed)
  resetPasswordExpires: Date (optional)
  createdAt: Date (default: Date.now, indexed)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `email`: unique
- `role`: for filtering
- `resetPasswordToken`: for password reset lookup
- `createdAt`: for sorting

**Relationships:**
- One-to-one with `TeacherProfile` (if role is TEACHER)
- One-to-one with `StudentProfile` (if role is STUDENT)

---

## TeacherProfile

Extended profile for teachers with application and approval workflow.

```typescript
{
  _id: ObjectId
  userId: ObjectId (required, ref: User, unique, indexed)
  status: 'PENDING' | 'APPROVED' | 'REJECTED' (required, default: 'PENDING', indexed)
  
  // Basic Info
  slug: string (required, unique, indexed, lowercase, URL-safe)
  firstName: string (required)
  lastName: string (required)
  image: string (Cloudinary URL, optional)
  coverImage: string (Cloudinary URL, optional)
  bio: string (optional, max 2000 chars)
  tagline: string (optional, max 200 chars)
  
  // Teaching Info
  subjects: string[] (required, indexed) // e.g., ['Mathematics', 'Physics']
  grades: string[] (required) // e.g., ['9', '10', '11', '12']
  experience: number (optional) // years of experience
  qualifications: string[] (optional) // e.g., ['B.Sc Mathematics', 'M.Ed']
  
  // Location
  location: {
    city: string (optional)
    state: string (optional)
    country: string (optional, default: 'India')
    address: string (optional)
    coordinates: {
      lat: number (optional)
      lng: number (optional)
    }
  }
  
  // Contact (private, shown only if visibility allows)
  contact: {
    email: string (optional)
    phone: string (optional)
    whatsapp: string (optional)
    website: string (optional)
  }
  
  // Visibility Controls
  visibility: {
    showEmail: boolean (default: false)
    showPhone: boolean (default: false)
    showWhatsAppButton: boolean (default: true)
    showSchedulePreview: boolean (default: true)
    showTestimonials: boolean (default: false)
    showClassFees: boolean (default: true)
    showLocation: boolean (default: true)
    showStudentCount: boolean (default: false)
    allowPublicAIChat: boolean (default: true)
  }
  
  // Website Customization (Legacy - kept for backward compatibility)
  customization: {
    themeColor: string (default: '#3b82f6') // hex color
    accentColor: string (default: '#8b5cf6') // hex color
    fontPairing: string (default: 'inter') // 'inter' | 'roboto' | 'poppins' | 'montserrat'
    highlights: string[] (max 6 items) // e.g., ['10+ years experience', 'Exam specialist']
    faqs: Array<{
      question: string (required)
      answer: string (required)
    }> (max 20 items)
  }
  
  // Website Configuration (New - Full customization system)
  websiteConfig: {
    // Theme Customization
    theme: {
      primaryColor: string (hex, default: '#3b82f6')
      accentColor: string (hex, default: '#8b5cf6')
      fontPairing: 'default' | 'modern' | 'classic' | 'elegant' (default: 'default')
      customCSS: string (optional, max 5000 chars) // Limited custom CSS
    }
    
    // Section Configuration (Order & Visibility)
    sections: Array<{
      id: string (required) // 'hero', 'about', 'subjects', 'classes', etc.
      type: string (required) // Section component type
      order: number (required) // Display order (0, 1, 2, ...)
      visible: boolean (default: true)
      config: {
        // Section-specific configuration
        // e.g., for Hero: { showTagline: true, showCoverImage: true }
        // e.g., for Classes: { layout: 'grid' | 'list', itemsPerRow: 3 }
        [key: string]: any
      }
    }>
    
    // Content Customization
    customContent: {
      hero: {
        title: string (optional, overrides default)
        subtitle: string (optional)
        ctaText: string (optional)
        ctaLink: string (optional)
      }
      about: {
        heading: string (optional)
        content: string (optional, can include HTML)
      }
      // ... other sections can be added
    }
    
    // SEO
    seo: {
      metaTitle: string (optional)
      metaDescription: string (optional)
      metaKeywords: string[] (optional)
      ogImage: string (optional, Cloudinary URL)
    }
  } (optional)
  
  // Verification
  verification: {
    documents: string[] (Cloudinary URLs, optional) // ID proof, certificates
    verifiedAt: Date (optional)
    verifiedBy: ObjectId (ref: User, optional)
    verificationNotes: string (optional)
  }
  
  // Approval/Rejection
  rejectionReason: string (optional)
  rejectedAt: Date (optional)
  rejectedBy: ObjectId (ref: User, optional)
  approvedAt: Date (optional)
  approvedBy: ObjectId (ref: User, optional)
  
  // Stats (computed, updated periodically)
  stats: {
    totalClasses: number (default: 0)
    totalStudents: number (default: 0)
    averageAttendance: number (default: 0) // percentage
  }
  
  createdAt: Date (default: Date.now, indexed)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `userId`: unique
- `status`: for filtering pending/approved teachers
- `slug`: unique, for public URL lookup
- `subjects`: for searching teachers by subject
- `createdAt`: for sorting

**Methods:**
- `generateSlug()`: Generate URL-safe slug from name
- `isApproved()`: Check if teacher is approved

---

## StudentProfile

Extended profile for students.

```typescript
{
  _id: ObjectId
  userId: ObjectId (required, ref: User, unique, indexed)
  
  // Basic Info
  firstName: string (required)
  lastName: string (required)
  dateOfBirth: Date (optional)
  grade: string (required, indexed) // e.g., '9', '10'
  school: string (optional)
  
  // Parent/Guardian Info
  parentName: string (optional)
  parentContact: string (optional)
  parentEmail: string (optional)
  relationship: string (optional) // 'Father', 'Mother', 'Guardian'
  
  // Contact
  phone: string (optional)
  address: string (optional)
  
  // Preferences
  preferredSubjects: string[] (optional)
  learningGoals: string (optional)
  
  // Teacher Linking (for teacher-specific registration)
  preferredTeachers: ObjectId[] (ref: User, indexed) // Teachers student registered with
  registeredWithTeacherAt: Date (optional) // Timestamp of first teacher registration
  
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `userId`: unique
- `grade`: for filtering students by grade
- `preferredTeachers`: for finding students linked to a teacher

---

## Class

Tuition batch/class created by teacher.

```typescript
{
  _id: ObjectId
  teacherId: ObjectId (required, ref: User, indexed)
  
  // Basic Info
  title: string (required) // e.g., 'Grade 10 Mathematics - Batch A'
  description: string (optional)
  subject: string (required, indexed) // e.g., 'Mathematics'
  grade: string (required, indexed) // e.g., '10'
  
  // Enrollment
  fee: number (optional) // monthly fee in INR
  capacity: number (required, default: 30)
  currentEnrollment: number (default: 0)
  autoApprove: boolean (default: false) // auto-approve enrollment requests
  
  // Schedule (default schedule rules)
  scheduleRules: {
    daysOfWeek: number[] (required) // 0-6 (Sunday-Saturday), e.g., [1, 3, 5]
    startTime: string (required) // HH:mm format, e.g., '18:00'
    endTime: string (required) // HH:mm format, e.g., '19:30'
    timezone: string (default: 'Asia/Kolkata')
    duration: number (optional) // minutes, calculated from start/end
  }
  
  // Visibility & Status
  visibility: 'PUBLIC' | 'PRIVATE' (required, default: 'PUBLIC', indexed)
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT' (required, default: 'DRAFT', indexed)
  
  // Invitation
  inviteCode: string (required, unique, indexed) // 6-8 character code
  inviteLink: string (required) // Full URL with code
  
  // Metadata
  tags: string[] (optional) // e.g., ['exam-prep', 'crash-course']
  startDate: Date (optional) // Class start date
  endDate: Date (optional) // Class end date
  
  createdAt: Date (default: Date.now, indexed)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `teacherId`: for listing teacher's classes
- `subject`: for filtering/searching
- `grade`: for filtering/searching
- `visibility`: for public class listings
- `status`: for filtering active classes
- `inviteCode`: unique, for join by code
- `createdAt`: for sorting

**Methods:**
- `generateInviteCode()`: Generate unique invite code
- `isFull()`: Check if class is at capacity
- `canEnroll()`: Check if enrollment is allowed

---

## Enrollment

Student enrollment in a class.

```typescript
{
  _id: ObjectId
  classId: ObjectId (required, ref: Class, indexed)
  studentId: ObjectId (required, ref: User, indexed)
  
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'REMOVED' (required, default: 'REQUESTED', indexed)
  
  // Request
  requestedAt: Date (default: Date.now)
  requestMessage: string (optional) // Student's message when requesting
  
  // Approval/Rejection
  approvedAt: Date (optional)
  approvedBy: ObjectId (ref: User, optional) // Teacher or Admin
  rejectedAt: Date (optional)
  rejectedBy: ObjectId (ref: User, optional)
  rejectionReason: string (optional)
  
  // Removal
  removedAt: Date (optional)
  removedBy: ObjectId (ref: User, optional)
  removalReason: string (optional)
  
  // Join
  joinedAt: Date (optional) // When student actually joined (approvedAt or auto-approved)
  
  // Invitation (if enrolled via invite)
  invitedBy: ObjectId (ref: User, optional)
  inviteCode: string (optional)
  
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- Compound unique: `(classId, studentId)` - One enrollment per student per class
- `classId`: for listing enrollments for a class
- `studentId`: for listing student's enrollments
- `status`: for filtering by status

**Methods:**
- `approve(approvedBy)`: Approve enrollment
- `reject(rejectedBy, reason)`: Reject enrollment
- `remove(removedBy, reason)`: Remove student

---

## Session

A scheduled class session (one-time or recurring instance).

```typescript
{
  _id: ObjectId
  classId: ObjectId (required, ref: Class, indexed)
  
  // Session Info
  title: string (required) // e.g., 'Algebra Basics'
  description: string (optional)
  startDateTime: Date (required, indexed)
  endDateTime: Date (required, indexed)
  
  // Recurrence
  isRecurring: boolean (default: false)
  recurrenceRule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' (required if recurring)
    interval: number (default: 1) // Every N days/weeks/months
    endDate: Date (optional) // Recurrence end date
    daysOfWeek: number[] (optional) // For WEEKLY: [1, 3, 5]
    dayOfMonth: number (optional) // For MONTHLY: 15
    count: number (optional) // Max number of occurrences
  } | null
  
  // Parent session (for recurring instances)
  parentSessionId: ObjectId (ref: Session, optional, indexed)
  
  // Status
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' (required, default: 'SCHEDULED', indexed)
  cancelledAt: Date (optional)
  cancelledBy: ObjectId (ref: User, optional)
  cancellationReason: string (optional)
  
  // Location
  location: string (optional) // Physical address or online link
  locationType: 'PHYSICAL' | 'ONLINE' | 'HYBRID' (default: 'PHYSICAL')
  meetingLink: string (optional) // Zoom, Google Meet, etc.
  
  // Metadata
  createdBy: ObjectId (required, ref: User)
  notes: string (optional) // Internal notes (not visible to students)
  
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `classId`: for listing sessions for a class
- `startDateTime`: for calendar queries
- `endDateTime`: for range queries
- `status`: for filtering
- `parentSessionId`: for recurring instance lookups

**Methods:**
- `isPast()`: Check if session is in the past
- `isUpcoming()`: Check if session is upcoming
- `cancel(cancelledBy, reason)`: Cancel session
- `complete()`: Mark as completed

---

## Attendance

Attendance record for a student in a session.

```typescript
{
  _id: ObjectId
  sessionId: ObjectId (required, ref: Session, indexed)
  classId: ObjectId (required, ref: Class, indexed)
  studentId: ObjectId (required, ref: User, indexed)
  
  status: 'PRESENT' | 'ABSENT' | 'LATE' (required, default: 'ABSENT')
  
  markedAt: Date (default: Date.now)
  markedBy: ObjectId (required, ref: User) // Teacher who marked
  
  // Late arrival
  arrivedAt: Date (optional) // Actual arrival time (if late)
  lateMinutes: number (optional) // Minutes late
  
  notes: string (optional) // Teacher's notes
  
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- Compound unique: `(sessionId, studentId)` - One attendance record per student per session
- `sessionId`: for listing attendance for a session
- `classId`: for attendance reports
- `studentId`: for student attendance history

**Methods:**
- `markPresent(markedBy)`: Mark as present
- `markAbsent(markedBy)`: Mark as absent
- `markLate(markedBy, arrivedAt)`: Mark as late

---

## Unit

A unit/chapter within a class.

```typescript
{
  _id: ObjectId
  classId: ObjectId (required, ref: Class, indexed)
  
  title: string (required) // e.g., 'Unit 1: Algebra'
  description: string (optional)
  order: number (required, default: 0) // For sorting
  
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `classId`: for listing units for a class
- Compound: `(classId, order)` for sorted queries

---

## Lesson

A lesson within a unit.

```typescript
{
  _id: ObjectId
  unitId: ObjectId (required, ref: Unit, indexed)
  
  title: string (required) // e.g., 'Lesson 1: Linear Equations'
  description: string (optional)
  order: number (required, default: 0) // For sorting within unit
  
  // Rich content blocks
  contentBlocks: Array<{
    type: 'text' | 'heading' | 'list' | 'embed' | 'code' | 'image' | 'video' (required)
    content: any // Type-specific content
    // For 'text': { text: string }
    // For 'heading': { level: 1-6, text: string }
    // For 'list': { items: string[], ordered: boolean }
    // For 'embed': { url: string, provider: 'youtube' | 'vimeo' | 'other' }
    // For 'code': { language: string, code: string }
    // For 'image': { url: string, alt: string, caption: string }
    // For 'video': { url: string, thumbnail: string }
  }>
  
  // Metadata
  estimatedDuration: number (optional) // minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' (optional)
  
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `unitId`: for listing lessons for a unit
- Compound: `(unitId, order)` for sorted queries

---

## Material

Files/resources attached to a lesson.

```typescript
{
  _id: ObjectId
  lessonId: ObjectId (required, ref: Lesson, indexed)
  
  type: 'PDF' | 'VIDEO' | 'LINK' | 'IMAGE' (required)
  title: string (required)
  url: string (required) // Cloudinary URL or external link
  thumbnailUrl: string (optional) // For videos
  
  // Metadata
  metadata: {
    size: number (optional) // bytes
    duration: number (optional) // seconds (for videos)
    mimeType: string (optional) // e.g., 'application/pdf'
    pages: number (optional) // For PDFs
    width: number (optional) // For images/videos
    height: number (optional) // For images/videos
  }
  
  description: string (optional)
  
  uploadedBy: ObjectId (required, ref: User)
  
  createdAt: Date (default: Date.now, indexed)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `lessonId`: for listing materials for a lesson
- `createdAt`: for sorting by upload date

---

## Conversation

Chat conversation (direct message or class chat).

```typescript
{
  _id: ObjectId
  type: 'DIRECT' | 'CLASS' (required, indexed)
  
  // For CLASS conversations
  classId: ObjectId (ref: Class, optional, indexed)
  
  // For DIRECT conversations
  participants: ObjectId[] (required, ref: User, indexed) // [teacherId, studentId]
  
  // Metadata
  lastMessageAt: Date (optional, indexed)
  lastMessage: {
    text: string (optional)
    senderId: ObjectId (ref: User, optional)
    createdAt: Date (optional)
  } (optional)
  
  // Unread counts per participant (computed)
  unreadCounts: Map<ObjectId, number> (optional) // userId -> count
  
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `type`: for filtering conversation type
- `classId`: for class conversations
- `participants`: for direct message lookups
- `lastMessageAt`: for sorting by recent activity
- Compound unique for DIRECT: `(type, participants)` - Ensure one DM conversation per pair

**Methods:**
- `getOtherParticipant(userId)`: Get the other participant in a DM
- `updateLastMessage(message)`: Update last message info

---

## Message

A message in a conversation.

```typescript
{
  _id: ObjectId
  conversationId: ObjectId (required, ref: Conversation, indexed)
  senderId: ObjectId (required, ref: User, indexed)
  
  text: string (optional) // Text content (optional if attachments)
  
  // Attachments
  attachments: Array<{
    type: 'image' | 'file' | 'video' | 'audio' (required)
    url: string (required) // Cloudinary URL
    name: string (optional)
    size: number (optional) // bytes
    mimeType: string (optional)
  }>
  
  // Read receipts
  readBy: Array<{
    userId: ObjectId (ref: User, required)
    readAt: Date (required, default: Date.now)
  }>
  
  // Reply to another message
  replyTo: ObjectId (ref: Message, optional)
  
  // Deletion
  deletedAt: Date (optional)
  deletedBy: ObjectId (ref: User, optional)
  
  createdAt: Date (default: Date.now, indexed)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `conversationId`: for listing messages in a conversation
- `senderId`: for user's sent messages
- `createdAt`: for sorting chronologically
- Compound: `(conversationId, createdAt)` for efficient pagination

**Methods:**
- `markAsRead(userId)`: Mark message as read by user
- `isReadBy(userId)`: Check if read by user
- `delete(deletedBy)`: Soft delete message

---

## Announcement

Announcement posted to a class.

```typescript
{
  _id: ObjectId
  classId: ObjectId (required, ref: Class, indexed)
  
  title: string (required)
  body: string (required) // Rich text or markdown
  
  priority: 'LOW' | 'MEDIUM' | 'HIGH' (default: 'MEDIUM', indexed)
  
  // Attachments
  attachments: Array<{
    type: 'file' | 'image' | 'link'
    url: string
    name: string
  }> (optional)
  
  // Pinned announcement
  isPinned: boolean (default: false)
  pinnedUntil: Date (optional)
  
  createdBy: ObjectId (required, ref: User)
  
  createdAt: Date (default: Date.now, indexed)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `classId`: for listing announcements for a class
- `priority`: for filtering
- `createdAt`: for sorting
- Compound: `(classId, createdAt)` for sorted class announcements

---

## Notification

User notification (in-app).

```typescript
{
  _id: ObjectId
  userId: ObjectId (required, ref: User, indexed)
  
  type: string (required, indexed) // 'ENROLLMENT_REQUEST', 'MESSAGE', 'SESSION_REMINDER', 'ANNOUNCEMENT', etc.
  
  title: string (required)
  body: string (required)
  
  // Action data
  payload: {
    actionType: string (optional) // 'VIEW_CLASS', 'VIEW_MESSAGE', etc.
    actionUrl: string (optional) // URL to navigate to
    targetId: ObjectId (optional) // Related entity ID
    targetType: string (optional) // 'CLASS', 'MESSAGE', 'SESSION', etc.
    metadata: object (optional) // Additional data
  }
  
  // Read status
  readAt: Date (optional, indexed)
  
  // Expiry (optional, for time-sensitive notifications)
  expiresAt: Date (optional)
  
  createdAt: Date (default: Date.now, indexed)
}
```

**Indexes:**
- `userId`: for user's notifications
- `readAt`: for filtering unread notifications
- `type`: for filtering by type
- `createdAt`: for sorting
- Compound: `(userId, readAt, createdAt)` for efficient unread queries

**Methods:**
- `markAsRead()`: Mark notification as read
- `isRead()`: Check if read
- `isExpired()`: Check if expired

---

## AdminAuditLog

Audit log for admin actions.

```typescript
{
  _id: ObjectId
  adminId: ObjectId (required, ref: User, indexed)
  
  action: string (required, indexed) // 'APPROVE_TEACHER', 'REJECT_TEACHER', 'SUSPEND_USER', etc.
  
  targetType: string (required) // 'TEACHER', 'STUDENT', 'CLASS', 'USER', etc.
  targetId: ObjectId (required, indexed)
  
  // Action details
  metadata: {
    previousValue: any (optional) // Previous state
    newValue: any (optional) // New state
    reason: string (optional)
    notes: string (optional)
  }
  
  // Request context
  ipAddress: string (optional)
  userAgent: string (optional)
  
  timestamp: Date (default: Date.now, indexed)
}
```

**Indexes:**
- `adminId`: for admin's action history
- `action`: for filtering by action type
- `targetId`: for entity's audit history
- `timestamp`: for sorting chronologically
- Compound: `(adminId, timestamp)` for admin activity reports

---

## Lead

Lead/inquiry from public teacher page (AI chat or contact form).

```typescript
{
  _id: ObjectId
  teacherId: ObjectId (required, ref: User, indexed)
  
  // Student Info
  studentName: string (required)
  grade: string (required)
  
  // Contact
  contactMethod: 'WHATSAPP' | 'EMAIL' | 'PHONE' (required)
  contactValue: string (required) // Phone number or email
  
  // Preferences
  preferredSubject: string (optional)
  message: string (optional)
  
  // Source
  source: 'AI_CHAT' | 'CONTACT_FORM' | 'MANUAL' (required, default: 'CONTACT_FORM')
  
  // Status
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED' (required, default: 'NEW', indexed)
  
  // Conversion tracking
  convertedAt: Date (optional)
  convertedToEnrollment: ObjectId (ref: Enrollment, optional)
  
  // Notes (teacher's internal notes)
  notes: string (optional)
  
  createdAt: Date (default: Date.now, indexed)
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `teacherId`: for teacher's leads
- `status`: for filtering by status
- `createdAt`: for sorting

**Methods:**
- `markAsContacted()`: Update status to CONTACTED
- `convertToEnrollment(enrollmentId)`: Mark as converted

---

## Database Indexes Summary

### Critical Indexes for Performance

1. **User**: `email` (unique), `role`
2. **TeacherProfile**: `userId` (unique), `status`, `slug` (unique), `subjects`
3. **Class**: `teacherId`, `subject`, `grade`, `status`, `inviteCode` (unique)
4. **Enrollment**: `(classId, studentId)` (unique), `status`
5. **Session**: `classId`, `startDateTime`, `endDateTime`, `status`
6. **Attendance**: `(sessionId, studentId)` (unique), `classId`
7. **Conversation**: `type`, `classId`, `participants`, `lastMessageAt`
8. **Message**: `conversationId`, `createdAt`
9. **Notification**: `userId`, `readAt`, `createdAt`

### Compound Indexes

- `Enrollment(classId, studentId)` - Unique constraint
- `Attendance(sessionId, studentId)` - Unique constraint
- `Conversation(type, participants)` - Unique for DIRECT conversations
- `Message(conversationId, createdAt)` - Efficient pagination
- `Notification(userId, readAt, createdAt)` - Unread notifications query

---

## Data Relationships Diagram

```
User (1) ──< (1) TeacherProfile
User (1) ──< (1) StudentProfile
User (1) ──< (*) Class (teacherId)
Class (1) ──< (*) Enrollment
Class (1) ──< (*) Session
Session (1) ──< (*) Attendance
Class (1) ──< (*) Unit
Unit (1) ──< (*) Lesson
Lesson (1) ──< (*) Material
Class (1) ──< (1) Conversation (CLASS)
User (2) ──< (1) Conversation (DIRECT)
Conversation (1) ──< (*) Message
Class (1) ──< (*) Announcement
User (1) ──< (*) Notification
User (1) ──< (*) AdminAuditLog
User (1) ──< (*) Lead (teacherId)
StudentProfile (*) ──< (*) User (preferredTeachers) // Student-Teacher linking
```

---

## Notes

- All timestamps use `Date` type (MongoDB Date)
- Use `ObjectId` for references (Mongoose will handle conversion)
- Indexes should be created during model initialization
- Consider TTL indexes for temporary data (e.g., password reset tokens)
- Use transactions for multi-document operations (enrollment, attendance marking)
