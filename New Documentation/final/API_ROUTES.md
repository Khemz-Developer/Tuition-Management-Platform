# API Routes - Complete Documentation

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.yourdomain.com/api`

## Authentication

Most endpoints require authentication via JWT Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

For refresh token endpoints, use:

```
Authorization: Bearer <refresh_token>
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin](#admin)
3. [Teacher](#teacher)
4. [Student](#student)
5. [Public](#public)
6. [File Upload](#file-upload)
7. [Common Query Parameters](#common-query-parameters)
8. [Error Responses](#error-responses)

---

## Authentication

### Register

**POST** `/api/auth/register`

Register a new user (role-based).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT", // "ADMIN" | "TEACHER" | "STUDENT"
  "firstName": "John",
  "lastName": "Doe"
}
```

**For Student Registration with Teacher Linking (Optional):**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "STUDENT",
  "firstName": "John",
  "lastName": "Doe",
  "teacherId": "teacher_id",       // Optional - Link to specific teacher by ID
  "teacherSlug": "jane-smith"      // Optional - Alternative: Link by teacher slug
}
```

> **Note:** When `teacherId` or `teacherSlug` is provided, the student will be automatically linked to that teacher. The teacher must be in APPROVED status.

**For Teacher Registration:**
```json
{
  "email": "teacher@example.com",
  "password": "password123",
  "role": "TEACHER",
  "firstName": "Jane",
  "lastName": "Smith",
  "teacherProfile": {
    "subjects": ["Mathematics", "Physics"],
    "grades": ["9", "10", "11"],
    "bio": "Experienced teacher...",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India"
    }
  }
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "STUDENT"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

---

### Login

**POST** `/api/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "STUDENT",
    "profile": { /* profile data */ }
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

---

### Refresh Token

**POST** `/api/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token" // Rotated
}
```

---

### Logout

**POST** `/api/auth/logout`

Logout and invalidate refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User

**GET** `/api/auth/me`

Get current authenticated user's profile.

**Response:** `200 OK`
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "TEACHER",
  "profile": { /* full profile data */ }
}
```

---

### Forgot Password

**POST** `/api/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset email sent"
}
```

---

### Reset Password

**POST** `/api/auth/reset-password`

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "new_password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset successfully"
}
```

---

## Admin

All admin endpoints require `ADMIN` role.

### Dashboard

**GET** `/api/admin/dashboard`

Get admin dashboard statistics.

**Response:** `200 OK`
```json
{
  "stats": {
    "totalTeachers": 50,
    "pendingTeachers": 5,
    "approvedTeachers": 45,
    "totalStudents": 500,
    "totalClasses": 120,
    "activeClasses": 100
  },
  "recentActivity": [
    { /* activity items */ }
  ],
  "teacherMetrics": [
    {
      "teacherId": "teacher_id",
      "name": "John Doe",
      "subjects": ["Math", "Physics"],
      "activeClasses": 5,
      "totalStudents": 50,
      "averageAttendance": 85.5
    }
  ]
}
```

---

### List Teachers

**GET** `/api/admin/teachers`

List all teachers with filtering and pagination.

**Query Parameters:**
- `status`: `PENDING` | `APPROVED` | `REJECTED` (optional)
- `subject`: string (optional)
- `grade`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (optional)

**Response:** `200 OK`
```json
{
  "teachers": [
    {
      "id": "teacher_id",
      "userId": "user_id",
      "status": "PENDING",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "teacher@example.com",
      "subjects": ["Mathematics"],
      "grades": ["9", "10"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### Get Teacher Details

**GET** `/api/admin/teachers/:id`

Get detailed teacher information.

**Response:** `200 OK`
```json
{
  "id": "teacher_id",
  "userId": "user_id",
  "status": "APPROVED",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "teacher@example.com",
  "subjects": ["Mathematics", "Physics"],
  "grades": ["9", "10", "11"],
  "bio": "Experienced teacher...",
  "location": { /* location object */ },
  "verification": { /* verification object */ },
  "classes": [
    { /* class objects */ }
  ],
  "stats": {
    "totalClasses": 5,
    "totalStudents": 50,
    "averageAttendance": 85.5
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Approve Teacher

**POST** `/api/admin/teachers/:id/approve`

Approve a pending teacher application.

**Request Body:**
```json
{
  "notes": "Approved after verification" // optional
}
```

**Response:** `200 OK`
```json
{
  "message": "Teacher approved successfully",
  "teacher": { /* updated teacher object */ }
}
```

---

### Reject Teacher

**POST** `/api/admin/teachers/:id/reject`

Reject a pending teacher application.

**Request Body:**
```json
{
  "reason": "Incomplete documentation"
}
```

**Response:** `200 OK`
```json
{
  "message": "Teacher rejected",
  "teacher": { /* updated teacher object */ }
}
```

---

### List Students

**GET** `/api/admin/students`

List all students with filtering and pagination.

**Query Parameters:**
- `grade`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (optional)

**Response:** `200 OK`
```json
{
  "students": [
    {
      "id": "student_id",
      "userId": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "student@example.com",
      "grade": "10",
      "school": "ABC High School",
      "enrolledClasses": 3,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Get Student Details

**GET** `/api/admin/students/:id`

Get detailed student information.

**Response:** `200 OK`
```json
{
  "id": "student_id",
  "userId": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "email": "student@example.com",
  "grade": "10",
  "school": "ABC High School",
  "enrolledClasses": [
    { /* class objects */ }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### List All Classes

**GET** `/api/admin/classes`

List all classes across all teachers.

**Query Parameters:**
- `teacherId`: string (optional)
- `subject`: string (optional)
- `grade`: string (optional)
- `status`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "classes": [ /* class objects */ ],
  "pagination": { /* pagination object */ }
}
```

---

### Analytics

**GET** `/api/admin/analytics`

Get analytics data for charts and reports.

**Query Parameters:**
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `groupBy`: `day` | `week` | `month` (default: `month`)

**Response:** `200 OK`
```json
{
  "enrollmentTrends": [
    { "date": "2024-01", "count": 50 }
  ],
  "attendanceTrends": [
    { "date": "2024-01", "average": 85.5 }
  ],
  "teacherStats": [
    {
      "teacherId": "teacher_id",
      "name": "Jane Smith",
      "totalStudents": 50,
      "averageAttendance": 85.5,
      "totalClasses": 5
    }
  ]
}
```

---

### Audit Logs

**GET** `/api/admin/audit-logs`

Get audit logs with filtering.

**Query Parameters:**
- `adminId`: string (optional)
- `action`: string (optional)
- `targetType`: string (optional)
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 50)

**Response:** `200 OK`
```json
{
  "logs": [
    {
      "id": "log_id",
      "adminId": "admin_id",
      "adminName": "Admin User",
      "action": "APPROVE_TEACHER",
      "targetType": "TEACHER",
      "targetId": "teacher_id",
      "metadata": { /* action metadata */ },
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Suspend User

**POST** `/api/admin/users/:id/suspend`

Suspend a user account.

**Request Body:**
```json
{
  "reason": "Violation of terms"
}
```

**Response:** `200 OK`
```json
{
  "message": "User suspended successfully"
}
```

---

### Unsuspend User

**POST** `/api/admin/users/:id/unsuspend`

Unsuspend a user account.

**Response:** `200 OK`
```json
{
  "message": "User unsuspended successfully"
}
```

---

### Get Site Settings

**GET** `/api/admin/settings`

Get site-wide settings.

**Response:** `200 OK`
```json
{
  "branding": {
    "siteName": "Tuition Management",
    "logo": "url",
    "favicon": "url"
  },
  "contact": {
    "email": "support@example.com",
    "phone": "+1234567890"
  },
  "terms": {
    "termsOfService": "url",
    "privacyPolicy": "url"
  },
  "features": {
    "allowPublicRegistration": true,
    "requireEmailVerification": false
  }
}
```

---

### Update Site Settings

**PUT** `/api/admin/settings`

Update site-wide settings.

**Request Body:**
```json
{
  "branding": { /* branding object */ },
  "contact": { /* contact object */ },
  "features": { /* features object */ }
}
```

**Response:** `200 OK`
```json
{
  "message": "Settings updated successfully",
  "settings": { /* updated settings */ }
}
```

---

### Impersonate Teacher (Optional)

**POST** `/api/admin/impersonate/:id`

Impersonate a teacher (for support purposes).

**Response:** `200 OK`
```json
{
  "accessToken": "impersonated_access_token",
  "message": "Impersonating teacher"
}
```

---

## Teacher

All teacher endpoints require `TEACHER` role and approved status.

### Dashboard

**GET** `/api/teacher/dashboard`

Get teacher dashboard statistics.

**Response:** `200 OK`
```json
{
  "stats": {
    "totalClasses": 5,
    "totalStudents": 50,
    "upcomingSessions": 3,
    "unreadMessages": 5
  },
  "upcomingSessions": [
    { /* session objects */ }
  ],
  "recentActivity": [
    { /* activity items */ }
  ]
}
```

---

### Get Profile

**GET** `/api/teacher/profile`

Get teacher's own profile.

**Response:** `200 OK`
```json
{
  "id": "teacher_id",
  "userId": "user_id",
  "status": "APPROVED",
  "firstName": "Jane",
  "lastName": "Smith",
  "slug": "jane-smith",
  "bio": "Experienced teacher...",
  "subjects": ["Mathematics", "Physics"],
  "grades": ["9", "10"],
  "location": { /* location object */ },
  "contact": { /* contact object */ },
  "visibility": { /* visibility object */ },
  "customization": { /* customization object */ }
}
```

---

### Update Profile

**PUT** `/api/teacher/profile`

Update teacher profile.

**Request Body:**
```json
{
  "bio": "Updated bio...",
  "subjects": ["Mathematics", "Physics", "Chemistry"],
  "grades": ["9", "10", "11"],
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "visibility": {
    "showEmail": true,
    "showPhone": false
  }
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "profile": { /* updated profile */ }
}
```

---

### Upload Profile Image

**POST** `/api/teacher/profile/image`

Upload profile image.

**Request:** `multipart/form-data`
- `image`: File (image file)

**Response:** `200 OK`
```json
{
  "imageUrl": "https://cloudinary.com/image.jpg",
  "message": "Image uploaded successfully"
}
```

---

### Upload Cover Image

**POST** `/api/teacher/profile/cover`

Upload cover image.

**Request:** `multipart/form-data`
- `image`: File (image file)

**Response:** `200 OK`
```json
{
  "coverImageUrl": "https://cloudinary.com/cover.jpg",
  "message": "Cover image uploaded successfully"
}
```

---

### List Classes

**GET** `/api/teacher/classes`

List teacher's classes.

**Query Parameters:**
- `status`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "classes": [
    {
      "id": "class_id",
      "title": "Grade 10 Mathematics",
      "subject": "Mathematics",
      "grade": "10",
      "currentEnrollment": 25,
      "capacity": 30,
      "status": "ACTIVE",
      "nextSession": { /* session object */ }
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Create Class

**POST** `/api/teacher/classes`

Create a new class.

**Request Body:**
```json
{
  "title": "Grade 10 Mathematics - Batch A",
  "description": "Comprehensive mathematics course...",
  "subject": "Mathematics",
  "grade": "10",
  "fee": 2000,
  "capacity": 30,
  "scheduleRules": {
    "daysOfWeek": [1, 3, 5], // Monday, Wednesday, Friday
    "startTime": "18:00",
    "endTime": "19:30",
    "timezone": "Asia/Kolkata"
  },
  "visibility": "PUBLIC",
  "autoApprove": false
}
```

**Response:** `201 Created`
```json
{
  "message": "Class created successfully",
  "class": { /* class object */ }
}
```

---

### Get Class Details

**GET** `/api/teacher/classes/:id`

Get detailed class information.

**Response:** `200 OK`
```json
{
  "id": "class_id",
  "title": "Grade 10 Mathematics",
  "description": "...",
  "subject": "Mathematics",
  "grade": "10",
  "fee": 2000,
  "capacity": 30,
  "currentEnrollment": 25,
  "scheduleRules": { /* schedule rules */ },
  "inviteCode": "ABC123",
  "inviteLink": "https://app.com/join/ABC123",
  "students": [ /* enrolled students */ ],
  "pendingEnrollments": [ /* enrollment requests */ ],
  "nextSession": { /* session object */ },
  "stats": {
    "averageAttendance": 85.5,
    "totalSessions": 50,
    "completedSessions": 45
  }
}
```

---

### Update Class

**PUT** `/api/teacher/classes/:id`

Update class details.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "capacity": 35,
  "fee": 2500
}
```

**Response:** `200 OK`
```json
{
  "message": "Class updated successfully",
  "class": { /* updated class */ }
}
```

---

### Delete Class

**DELETE** `/api/teacher/classes/:id`

Delete a class (soft delete or hard delete).

**Response:** `200 OK`
```json
{
  "message": "Class deleted successfully"
}
```

---

### Get Class Students

**GET** `/api/teacher/classes/:id/students`

Get enrolled students for a class.

**Response:** `200 OK`
```json
{
  "students": [
    {
      "id": "student_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "student@example.com",
      "grade": "10",
      "enrolledAt": "2024-01-01T00:00:00Z",
      "attendancePercentage": 85.5
    }
  ]
}
```

---

### Generate Invite Link

**POST** `/api/teacher/classes/:id/invite`

Generate or regenerate invite code/link.

**Response:** `200 OK`
```json
{
  "inviteCode": "ABC123",
  "inviteLink": "https://app.com/join/ABC123"
}
```

---

### List Enrollment Requests

**GET** `/api/teacher/enrollments`

List enrollment requests for teacher's classes.

**Query Parameters:**
- `status`: `REQUESTED` | `APPROVED` | `REJECTED` (optional)
- `classId`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "enrollments": [
    {
      "id": "enrollment_id",
      "classId": "class_id",
      "className": "Grade 10 Mathematics",
      "studentId": "student_id",
      "studentName": "John Doe",
      "status": "REQUESTED",
      "requestedAt": "2024-01-01T00:00:00Z",
      "requestMessage": "I want to join this class"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Approve Enrollment

**POST** `/api/teacher/enrollments/:id/approve`

Approve an enrollment request.

**Response:** `200 OK`
```json
{
  "message": "Enrollment approved",
  "enrollment": { /* updated enrollment */ }
}
```

---

### Reject Enrollment

**POST** `/api/teacher/enrollments/:id/reject`

Reject an enrollment request.

**Request Body:**
```json
{
  "reason": "Class is full" // optional
}
```

**Response:** `200 OK`
```json
{
  "message": "Enrollment rejected",
  "enrollment": { /* updated enrollment */ }
}
```

---

### List Sessions

**GET** `/api/teacher/sessions`

List sessions for teacher's classes.

**Query Parameters:**
- `classId`: string (optional)
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `status`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "sessions": [
    {
      "id": "session_id",
      "classId": "class_id",
      "className": "Grade 10 Mathematics",
      "title": "Algebra Basics",
      "startDateTime": "2024-01-15T18:00:00Z",
      "endDateTime": "2024-01-15T19:30:00Z",
      "status": "SCHEDULED",
      "attendanceMarked": false,
      "totalStudents": 25,
      "presentCount": 0
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Create Session

**POST** `/api/teacher/sessions`

Create a session (single or recurring).

**Request Body (Single Session):**
```json
{
  "classId": "class_id",
  "title": "Algebra Basics",
  "description": "Introduction to algebra",
  "startDateTime": "2024-01-15T18:00:00Z",
  "endDateTime": "2024-01-15T19:30:00Z",
  "location": "Room 101",
  "locationType": "PHYSICAL"
}
```

**Request Body (Recurring Session):**
```json
{
  "classId": "class_id",
  "title": "Weekly Math Class",
  "startDateTime": "2024-01-15T18:00:00Z",
  "endDateTime": "2024-01-15T19:30:00Z",
  "isRecurring": true,
  "recurrenceRule": {
    "frequency": "WEEKLY",
    "interval": 1,
    "daysOfWeek": [1, 3, 5],
    "endDate": "2024-06-30T00:00:00Z"
  }
}
```

**Response:** `201 Created`
```json
{
  "message": "Session created successfully",
  "session": { /* session object */ },
  "recurringInstances": [ /* if recurring */ ]
}
```

---

### Get Session Details

**GET** `/api/teacher/sessions/:id`

Get detailed session information.

**Response:** `200 OK`
```json
{
  "id": "session_id",
  "classId": "class_id",
  "className": "Grade 10 Mathematics",
  "title": "Algebra Basics",
  "startDateTime": "2024-01-15T18:00:00Z",
  "endDateTime": "2024-01-15T19:30:00Z",
  "status": "SCHEDULED",
  "location": "Room 101",
  "attendance": [
    {
      "studentId": "student_id",
      "studentName": "John Doe",
      "status": "PRESENT",
      "markedAt": "2024-01-15T19:35:00Z"
    }
  ]
}
```

---

### Update Session

**PUT** `/api/teacher/sessions/:id`

Update session details.

**Request Body:**
```json
{
  "title": "Updated title",
  "startDateTime": "2024-01-15T19:00:00Z",
  "endDateTime": "2024-01-15T20:30:00Z",
  "location": "Room 102"
}
```

**Response:** `200 OK`
```json
{
  "message": "Session updated successfully",
  "session": { /* updated session */ }
}
```

---

### Delete Session

**DELETE** `/api/teacher/sessions/:id`

Delete a session (or cancel if recurring instance).

**Query Parameters:**
- `cancelRecurring`: boolean (if true, cancels all future instances)

**Response:** `200 OK`
```json
{
  "message": "Session deleted successfully"
}
```

---

### Get Session Attendance

**GET** `/api/teacher/sessions/:id/attendance`

Get attendance records for a session.

**Response:** `200 OK`
```json
{
  "sessionId": "session_id",
  "sessionTitle": "Algebra Basics",
  "attendance": [
    {
      "id": "attendance_id",
      "studentId": "student_id",
      "studentName": "John Doe",
      "status": "PRESENT",
      "markedAt": "2024-01-15T19:35:00Z"
    }
  ],
  "summary": {
    "total": 25,
    "present": 20,
    "absent": 4,
    "late": 1
  }
}
```

---

### Mark Attendance

**POST** `/api/teacher/sessions/:id/attendance`

Mark attendance for a session (bulk).

**Request Body:**
```json
{
  "attendance": [
    {
      "studentId": "student_id",
      "status": "PRESENT"
    },
    {
      "studentId": "student_id_2",
      "status": "ABSENT"
    },
    {
      "studentId": "student_id_3",
      "status": "LATE",
      "arrivedAt": "2024-01-15T18:15:00Z"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Attendance marked successfully",
  "attendance": [ /* attendance records */ ]
}
```

---

### List Units

**GET** `/api/teacher/classes/:id/units`

Get units for a class.

**Response:** `200 OK`
```json
{
  "units": [
    {
      "id": "unit_id",
      "title": "Unit 1: Algebra",
      "description": "...",
      "order": 1,
      "lessonsCount": 5
    }
  ]
}
```

---

### Create Unit

**POST** `/api/teacher/classes/:id/units`

Create a new unit.

**Request Body:**
```json
{
  "title": "Unit 1: Algebra",
  "description": "Introduction to algebra",
  "order": 1
}
```

**Response:** `201 Created`
```json
{
  "message": "Unit created successfully",
  "unit": { /* unit object */ }
}
```

---

### Update Unit

**PUT** `/api/teacher/units/:id`

Update a unit.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "order": 2
}
```

**Response:** `200 OK`
```json
{
  "message": "Unit updated successfully",
  "unit": { /* updated unit */ }
}
```

---

### Delete Unit

**DELETE** `/api/teacher/units/:id`

Delete a unit (and all its lessons).

**Response:** `200 OK`
```json
{
  "message": "Unit deleted successfully"
}
```

---

### List Lessons

**GET** `/api/teacher/units/:id/lessons`

Get lessons for a unit.

**Response:** `200 OK`
```json
{
  "lessons": [
    {
      "id": "lesson_id",
      "title": "Lesson 1: Linear Equations",
      "description": "...",
      "order": 1,
      "materialsCount": 3
    }
  ]
}
```

---

### Create Lesson

**POST** `/api/teacher/units/:id/lessons`

Create a new lesson.

**Request Body:**
```json
{
  "title": "Lesson 1: Linear Equations",
  "description": "Introduction to linear equations",
  "order": 1,
  "contentBlocks": [
    {
      "type": "heading",
      "content": { "level": 2, "text": "Introduction" }
    },
    {
      "type": "text",
      "content": { "text": "Linear equations are..." }
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Lesson created successfully",
  "lesson": { /* lesson object */ }
}
```

---

### Update Lesson

**PUT** `/api/teacher/lessons/:id`

Update a lesson.

**Request Body:**
```json
{
  "title": "Updated title",
  "contentBlocks": [ /* updated content blocks */ ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Lesson updated successfully",
  "lesson": { /* updated lesson */ }
}
```

---

### Delete Lesson

**DELETE** `/api/teacher/lessons/:id`

Delete a lesson (and all its materials).

**Response:** `200 OK`
```json
{
  "message": "Lesson deleted successfully"
}
```

---

### Upload Material

**POST** `/api/teacher/lessons/:id/materials`

Upload a material file.

**Request:** `multipart/form-data`
- `file`: File (PDF, image, video)
- `title`: string
- `description`: string (optional)

**Response:** `201 Created`
```json
{
  "message": "Material uploaded successfully",
  "material": {
    "id": "material_id",
    "type": "PDF",
    "title": "Algebra Notes",
    "url": "https://cloudinary.com/file.pdf",
    "metadata": { /* file metadata */ }
  }
}
```

---

### Delete Material

**DELETE** `/api/teacher/materials/:id`

Delete a material.

**Response:** `200 OK`
```json
{
  "message": "Material deleted successfully"
}
```

---

### List Conversations

**GET** `/api/teacher/conversations`

List teacher's conversations (class chats and DMs).

**Query Parameters:**
- `type`: `DIRECT` | `CLASS` (optional)

**Response:** `200 OK`
```json
{
  "conversations": [
    {
      "id": "conversation_id",
      "type": "CLASS",
      "classId": "class_id",
      "className": "Grade 10 Mathematics",
      "lastMessage": {
        "text": "Hello everyone",
        "senderName": "John Doe",
        "createdAt": "2024-01-01T00:00:00Z"
      },
      "unreadCount": 5
    }
  ]
}
```

---

### Get Conversation

**GET** `/api/teacher/conversations/:id`

Get conversation with messages.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 50)

**Response:** `200 OK`
```json
{
  "id": "conversation_id",
  "type": "CLASS",
  "classId": "class_id",
  "className": "Grade 10 Mathematics",
  "messages": [
    {
      "id": "message_id",
      "senderId": "user_id",
      "senderName": "John Doe",
      "text": "Hello",
      "createdAt": "2024-01-01T00:00:00Z",
      "readBy": ["user_id_2"]
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Send Message

**POST** `/api/teacher/conversations/:id/messages`

Send a message in a conversation.

**Request Body:**
```json
{
  "text": "Hello everyone",
  "attachments": [ /* optional */ ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Message sent",
  "message": { /* message object */ }
}
```

---

### List Announcements

**GET** `/api/teacher/classes/:id/announcements`

List announcements for a class.

**Response:** `200 OK`
```json
{
  "announcements": [
    {
      "id": "announcement_id",
      "title": "Important Notice",
      "body": "Please submit your assignments...",
      "priority": "HIGH",
      "isPinned": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Announcement

**POST** `/api/teacher/classes/:id/announcements`

Create an announcement.

**Request Body:**
```json
{
  "title": "Important Notice",
  "body": "Please submit your assignments by Friday",
  "priority": "HIGH",
  "isPinned": true
}
```

**Response:** `201 Created`
```json
{
  "message": "Announcement created",
  "announcement": { /* announcement object */ }
}
```

---

### Update Announcement

**PUT** `/api/teacher/announcements/:id`

Update an announcement.

**Request Body:**
```json
{
  "title": "Updated title",
  "body": "Updated body"
}
```

**Response:** `200 OK`
```json
{
  "message": "Announcement updated",
  "announcement": { /* updated announcement */ }
}
```

---

### Delete Announcement

**DELETE** `/api/teacher/announcements/:id`

Delete an announcement.

**Response:** `200 OK`
```json
{
  "message": "Announcement deleted"
}
```

---

### List Registered Students

**GET** `/api/teacher/students`

Get all students who registered through the teacher's public page or are linked to this teacher.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (optional)
- `sortBy`: `registeredAt` | `name` | `email` (default: registeredAt)
- `sortOrder`: `asc` | `desc` (default: desc)

**Response:** `200 OK`
```json
{
  "students": [
    {
      "id": "student_id",
      "userId": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "student@example.com",
      "phone": "+91-9876543210",
      "grade": "10",
      "registeredAt": "2024-01-15T10:30:00Z",
      "enrolledClasses": [
        {
          "classId": "class_id",
          "className": "Mathematics Grade 10",
          "status": "ACTIVE"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### List Leads

**GET** `/api/teacher/leads`

List leads/inquiries from public page.

**Query Parameters:**
- `status`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "leads": [
    {
      "id": "lead_id",
      "studentName": "John Doe",
      "grade": "10",
      "contactMethod": "WHATSAPP",
      "contactValue": "+1234567890",
      "preferredSubject": "Mathematics",
      "message": "I want to join",
      "status": "NEW",
      "source": "AI_CHAT",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Update Lead Status

**PUT** `/api/teacher/leads/:id`

Update lead status.

**Request Body:**
```json
{
  "status": "CONTACTED",
  "notes": "Called student, interested in joining"
}
```

**Response:** `200 OK`
```json
{
  "message": "Lead updated",
  "lead": { /* updated lead */ }
}
```

---

### Get Website Configuration

**GET** `/api/teacher/website/config`

Get teacher's website configuration (theme, sections, content, SEO).

**Response:** `200 OK`
```json
{
  "websiteConfig": {
    "theme": {
      "primaryColor": "#3b82f6",
      "accentColor": "#8b5cf6",
      "fontPairing": "default",
      "customCSS": "" // Optional custom CSS
    },
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "config": {
          "showTagline": true,
          "showCoverImage": true,
          "coverImageOpacity": 0.3,
          "ctaButtonText": "Get Started",
          "ctaButtonLink": "#contact"
        }
      },
      {
        "id": "about",
        "type": "about",
        "order": 1,
        "visible": true,
        "config": {}
      },
      {
        "id": "classes",
        "type": "classes",
        "order": 4,
        "visible": true,
        "config": {
          "layout": "grid",
          "itemsPerRow": 3,
          "showFees": true,
          "showEnrollmentButton": true,
          "maxItems": 6
        }
      }
    ],
    "customContent": {
      "hero": {
        "title": "Welcome to My Classes",
        "subtitle": "Expert Mathematics Teacher",
        "ctaText": "Join Now",
        "ctaLink": "#contact"
      },
      "about": {
        "heading": "About Me",
        "content": "<p>Custom HTML content here...</p>"
      }
    },
    "seo": {
      "metaTitle": "Jane Smith - Mathematics Teacher",
      "metaDescription": "Experienced mathematics teacher offering classes for grades 9-11",
      "metaKeywords": ["mathematics", "teacher", "tuition", "grade 10"],
      "ogImage": "https://cloudinary.com/og-image.jpg"
    }
  }
}
```

---

### Update Website Configuration

**PUT** `/api/teacher/website/config`

Update teacher's website configuration. Can update theme, sections, custom content, or SEO settings.

**Request Body:**
```json
{
  "theme": {
    "primaryColor": "#3b82f6",
    "accentColor": "#8b5cf6",
    "fontPairing": "modern",
    "customCSS": ".custom-class { color: red; }"
  },
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "order": 0,
      "visible": true,
      "config": {
        "showTagline": true,
        "showCoverImage": true
      }
    }
  ],
  "customContent": {
    "hero": {
      "title": "Updated Title",
      "subtitle": "Updated Subtitle"
    }
  },
  "seo": {
    "metaTitle": "Updated Title",
    "metaDescription": "Updated description"
  }
}
```

**Note:** You can send partial updates. Only include the fields you want to update.

**Response:** `200 OK`
```json
{
  "message": "Website configuration updated successfully",
  "websiteConfig": { /* updated config */ }
}
```

---

### Reorder Sections

**POST** `/api/teacher/website/sections/reorder`

Reorder website sections by updating their order values.

**Request Body:**
```json
{
  "sections": [
    {
      "id": "hero",
      "order": 0
    },
    {
      "id": "about",
      "order": 1
    },
    {
      "id": "highlights",
      "order": 2
    },
    {
      "id": "classes",
      "order": 3
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Sections reordered successfully",
  "sections": [ /* updated sections array */ ]
}
```

---

### Update Section Configuration

**PUT** `/api/teacher/website/sections/:sectionId`

Update configuration for a specific section.

**Request Body:**
```json
{
  "visible": true,
  "config": {
    "layout": "grid",
    "itemsPerRow": 3,
    "showFees": true,
    "maxItems": 6
  }
}
```

**Response:** `200 OK`
```json
{
  "message": "Section updated successfully",
  "section": {
    "id": "classes",
    "type": "classes",
    "order": 4,
    "visible": true,
    "config": { /* updated config */ }
  }
}
```

---

## Student

All student endpoints require `STUDENT` role.

### Dashboard

**GET** `/api/student/dashboard`

Get student dashboard.

**Response:** `200 OK`
```json
{
  "upcomingSessions": [
    { /* session objects */ }
  ],
  "newAnnouncements": [
    { /* announcement objects */ }
  ],
  "newMaterials": [
    { /* material objects */ }
  ],
  "unreadMessages": 5,
  "enrolledClasses": 3
}
```

---

### Get Profile

**GET** `/api/student/profile`

Get student's own profile.

**Response:** `200 OK`
```json
{
  "id": "student_id",
  "userId": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "grade": "10",
  "school": "ABC High School",
  "dateOfBirth": "2008-01-01T00:00:00Z"
}
```

---

### Update Profile

**PUT** `/api/student/profile`

Update student profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "grade": "10",
  "school": "ABC High School"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "profile": { /* updated profile */ }
}
```

---

### Get Linked Teachers

**GET** `/api/student/teachers`

Get list of teachers the student is linked to (registered through their public page).

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "teachers": [
    {
      "id": "teacher_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "slug": "jane-smith",
      "profileImageUrl": "https://cdn.example.com/teachers/jane-smith.jpg",
      "subjects": ["Mathematics", "Physics"],
      "grades": ["9", "10", "11"],
      "linkedAt": "2024-01-15T10:30:00Z",
      "enrolledClasses": [
        {
          "classId": "class_id",
          "className": "Mathematics Grade 10",
          "status": "ACTIVE"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

---

### Browse Classes

**GET** `/api/student/classes`

Browse and search classes.

**Query Parameters:**
- `subject`: string (optional)
- `grade`: string (optional)
- `teacherId`: string (optional)
- `search`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "classes": [
    {
      "id": "class_id",
      "title": "Grade 10 Mathematics",
      "subject": "Mathematics",
      "grade": "10",
      "teacherName": "Jane Smith",
      "teacherSlug": "jane-smith",
      "fee": 2000,
      "currentEnrollment": 25,
      "capacity": 30,
      "scheduleRules": { /* schedule rules */ },
      "isEnrolled": false
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Get Class Details

**GET** `/api/student/classes/:id`

Get public class details.

**Response:** `200 OK`
```json
{
  "id": "class_id",
  "title": "Grade 10 Mathematics",
  "description": "...",
  "subject": "Mathematics",
  "grade": "10",
  "teacherName": "Jane Smith",
  "teacherSlug": "jane-smith",
  "fee": 2000,
  "scheduleRules": { /* schedule rules */ },
  "isEnrolled": false,
  "enrollmentStatus": null // or "REQUESTED" | "APPROVED"
}
```

---

### Get My Classes

**GET** `/api/student/my-classes`

Get enrolled classes.

**Response:** `200 OK`
```json
{
  "classes": [
    {
      "id": "class_id",
      "title": "Grade 10 Mathematics",
      "subject": "Mathematics",
      "grade": "10",
      "teacherName": "Jane Smith",
      "enrolledAt": "2024-01-01T00:00:00Z",
      "nextSession": { /* session object */ },
      "unreadAnnouncements": 2,
      "newMaterials": 3
    }
  ]
}
```

---

### Request Enrollment

**POST** `/api/student/classes/:id/enroll`

Request enrollment in a class.

**Request Body:**
```json
{
  "message": "I want to join this class" // optional
}
```

**Response:** `201 Created`
```json
{
  "message": "Enrollment request submitted",
  "enrollment": { /* enrollment object */ }
}
```

---

### Cancel Enrollment Request

**POST** `/api/student/enrollments/:id/cancel`

Cancel a pending enrollment request.

**Response:** `200 OK`
```json
{
  "message": "Enrollment request cancelled"
}
```

---

### Get Class Sessions

**GET** `/api/student/classes/:id/sessions`

Get sessions for an enrolled class.

**Query Parameters:**
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)

**Response:** `200 OK`
```json
{
  "sessions": [
    {
      "id": "session_id",
      "title": "Algebra Basics",
      "startDateTime": "2024-01-15T18:00:00Z",
      "endDateTime": "2024-01-15T19:30:00Z",
      "location": "Room 101",
      "attendance": {
        "status": "PRESENT",
        "markedAt": "2024-01-15T19:35:00Z"
      }
    }
  ]
}
```

---

### Get Class Calendar

**GET** `/api/student/classes/:id/calendar`

Get calendar view for a class.

**Query Parameters:**
- `startDate`: ISO date string (required)
- `endDate`: ISO date string (required)

**Response:** `200 OK`
```json
{
  "sessions": [
    { /* session objects */ }
  ]
}
```

---

### Get Attendance History

**GET** `/api/student/classes/:id/attendance`

Get attendance history for a class.

**Response:** `200 OK`
```json
{
  "attendance": [
    {
      "sessionId": "session_id",
      "sessionTitle": "Algebra Basics",
      "sessionDate": "2024-01-15T18:00:00Z",
      "status": "PRESENT",
      "markedAt": "2024-01-15T19:35:00Z"
    }
  ],
  "summary": {
    "totalSessions": 50,
    "present": 42,
    "absent": 6,
    "late": 2,
    "attendancePercentage": 84.0
  }
}
```

---

### Get Class Content

**GET** `/api/student/classes/:id/units`

Get units, lessons, and materials for a class.

**Response:** `200 OK`
```json
{
  "units": [
    {
      "id": "unit_id",
      "title": "Unit 1: Algebra",
      "order": 1,
      "lessons": [
        {
          "id": "lesson_id",
          "title": "Lesson 1: Linear Equations",
          "order": 1,
          "materials": [
            {
              "id": "material_id",
              "type": "PDF",
              "title": "Algebra Notes",
              "url": "https://cloudinary.com/file.pdf"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### Get Lesson Details

**GET** `/api/student/lessons/:id`

Get detailed lesson content.

**Response:** `200 OK`
```json
{
  "id": "lesson_id",
  "title": "Lesson 1: Linear Equations",
  "description": "...",
  "contentBlocks": [
    { /* content blocks */ }
  ],
  "materials": [
    { /* material objects */ }
  ]
}
```

---

### List Conversations

**GET** `/api/student/conversations`

List student's conversations.

**Response:** `200 OK`
```json
{
  "conversations": [
    {
      "id": "conversation_id",
      "type": "CLASS",
      "classId": "class_id",
      "className": "Grade 10 Mathematics",
      "lastMessage": { /* last message */ },
      "unreadCount": 3
    }
  ]
}
```

---

### Get Conversation

**GET** `/api/student/conversations/:id`

Get conversation with messages.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 50)

**Response:** `200 OK`
```json
{
  "id": "conversation_id",
  "type": "CLASS",
  "messages": [ /* message objects */ ],
  "pagination": { /* pagination object */ }
}
```

---

### Send Message

**POST** `/api/student/conversations/:id/messages`

Send a message.

**Request Body:**
```json
{
  "text": "Hello",
  "attachments": [ /* optional */ ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Message sent",
  "message": { /* message object */ }
}
```

---

### Get Announcements

**GET** `/api/student/announcements`

Get announcements for enrolled classes.

**Query Parameters:**
- `classId`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "announcements": [
    {
      "id": "announcement_id",
      "classId": "class_id",
      "className": "Grade 10 Mathematics",
      "title": "Important Notice",
      "body": "...",
      "priority": "HIGH",
      "isPinned": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "isRead": false
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Get Notifications

**GET** `/api/student/notifications`

Get student's notifications.

**Query Parameters:**
- `read`: boolean (optional, filter by read status)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": "notification_id",
      "type": "ENROLLMENT_APPROVED",
      "title": "Enrollment Approved",
      "body": "Your enrollment request for Grade 10 Mathematics has been approved",
      "payload": {
        "actionType": "VIEW_CLASS",
        "actionUrl": "/my-classes/class_id"
      },
      "readAt": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Mark Notification as Read

**PUT** `/api/student/notifications/:id/read`

Mark a notification as read.

**Response:** `200 OK`
```json
{
  "message": "Notification marked as read"
}
```

---

## Public

Public endpoints (no authentication required).

### List Public Teachers

**GET** `/api/public/teachers`

List public teachers (directory page).

**Query Parameters:**
- `subject`: string (optional)
- `grade`: string (optional)
- `city`: string (optional)
- `search`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:** `200 OK`
```json
{
  "teachers": [
    {
      "id": "teacher_id",
      "slug": "jane-smith",
      "firstName": "Jane",
      "lastName": "Smith",
      "image": "https://cloudinary.com/image.jpg",
      "tagline": "Experienced Mathematics Teacher",
      "subjects": ["Mathematics", "Physics"],
      "grades": ["9", "10"],
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra"
      }
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### Get Public Teacher Profile

**GET** `/api/public/teachers/:slug`

Get public teacher profile with website configuration (for public website rendering).

**Response:** `200 OK`
```json
{
  "id": "teacher_id",
  "slug": "jane-smith",
  "firstName": "Jane",
  "lastName": "Smith",
  "image": "https://cloudinary.com/image.jpg",
  "coverImage": "https://cloudinary.com/cover.jpg",
  "tagline": "Experienced Mathematics Teacher",
  "bio": "I have been teaching for 10+ years...",
  "subjects": ["Mathematics", "Physics"],
  "grades": ["9", "10", "11"],
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "contact": {
    "email": "jane@example.com", // Only if showEmail is true
    "phone": "+1234567890", // Only if showPhone is true
    "whatsapp": "+1234567890" // Only if showWhatsAppButton is true
  },
  "highlights": ["10+ years experience", "Exam specialist"],
  "faqs": [
    {
      "question": "What classes do you teach?",
      "answer": "I teach Mathematics and Physics for grades 9-11"
    }
  ],
  "publicClasses": [
    {
      "id": "class_id",
      "title": "Grade 10 Mathematics",
      "subject": "Mathematics",
      "grade": "10",
      "fee": 2000, // Only if showClassFees is true
      "scheduleRules": { /* Only if showSchedulePreview is true */ }
    }
  ],
  "schedulePreview": { /* Only if showSchedulePreview is true */ },
  "websiteConfig": {
    "theme": {
      "primaryColor": "#3b82f6",
      "accentColor": "#8b5cf6",
      "fontPairing": "default",
      "customCSS": ""
    },
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "config": {
          "showTagline": true,
          "showCoverImage": true,
          "coverImageOpacity": 0.3,
          "ctaButtonText": "Get Started",
          "ctaButtonLink": "#contact"
        }
      },
      {
        "id": "about",
        "type": "about",
        "order": 1,
        "visible": true,
        "config": {}
      },
      {
        "id": "highlights",
        "type": "highlights",
        "order": 2,
        "visible": true,
        "config": {}
      },
      {
        "id": "subjects",
        "type": "subjects",
        "order": 3,
        "visible": true,
        "config": {}
      },
      {
        "id": "classes",
        "type": "classes",
        "order": 4,
        "visible": true,
        "config": {
          "layout": "grid",
          "itemsPerRow": 3,
          "showFees": true,
          "showEnrollmentButton": true,
          "maxItems": 6
        }
      },
      {
        "id": "schedule",
        "type": "schedule",
        "order": 5,
        "visible": true,
        "config": {}
      },
      {
        "id": "testimonials",
        "type": "testimonials",
        "order": 6,
        "visible": false,
        "config": {}
      },
      {
        "id": "contact",
        "type": "contact",
        "order": 7,
        "visible": true,
        "config": {}
      }
    ],
    "customContent": {
      "hero": {
        "title": "Welcome to My Classes",
        "subtitle": "Expert Mathematics Teacher",
        "ctaText": "Join Now",
        "ctaLink": "#contact"
      },
      "about": {
        "heading": "About Me",
        "content": "<p>Custom HTML content here...</p>"
      }
    },
    "seo": {
      "metaTitle": "Jane Smith - Mathematics Teacher",
      "metaDescription": "Experienced mathematics teacher offering classes for grades 9-11",
      "metaKeywords": ["mathematics", "teacher", "tuition", "grade 10"],
      "ogImage": "https://cloudinary.com/og-image.jpg"
    }
  }
}
```

**Note:** The `websiteConfig` contains all information needed to dynamically render the public teacher page, including section order, visibility, theme settings, and custom content.

---

### Get Public Classes

**GET** `/api/public/teachers/:slug/classes`

Get public classes for a teacher.

**Response:** `200 OK`
```json
{
  "classes": [
    {
      "id": "class_id",
      "title": "Grade 10 Mathematics",
      "subject": "Mathematics",
      "grade": "10",
      "fee": 2000,
      "scheduleRules": { /* schedule rules */ }
    }
  ]
}
```

---

### Get Public Class Details

**GET** `/api/public/classes/:id`

Get limited public class details.

**Response:** `200 OK`
```json
{
  "id": "class_id",
  "title": "Grade 10 Mathematics",
  "description": "...",
  "subject": "Mathematics",
  "grade": "10",
  "teacherName": "Jane Smith",
  "teacherSlug": "jane-smith",
  "fee": 2000,
  "scheduleRules": { /* schedule rules */ },
  "currentEnrollment": 25, // Only if showStudentCount is true
  "capacity": 30
}
```

---

### Contact Teacher / Lead Capture

**POST** `/api/public/teachers/:slug/contact`

Submit contact form or lead capture.

**Request Body:**
```json
{
  "studentName": "John Doe",
  "grade": "10",
  "contactMethod": "WHATSAPP",
  "contactValue": "+1234567890",
  "preferredSubject": "Mathematics",
  "message": "I want to join your class"
}
```

**Response:** `201 Created`
```json
{
  "message": "Thank you! We'll contact you soon.",
  "leadId": "lead_id"
}
```

---

### AI Chat

**POST** `/api/public/ai/chat`

Public AI chat endpoint (for teacher page chat widget).

**Request Body:**
```json
{
  "teacherSlug": "jane-smith",
  "message": "What classes do you teach?",
  "conversationId": "conversation_id" // Optional, for continuing conversation
}
```

**Response:** `200 OK`
```json
{
  "response": "I teach Mathematics and Physics for grades 9-11. Would you like to know more about a specific class?",
  "conversationId": "conversation_id",
  "suggestedActions": [
    {
      "type": "VIEW_CLASSES",
      "label": "View Classes",
      "url": "/t/jane-smith#classes"
    },
    {
      "type": "CONTACT",
      "label": "Contact Teacher",
      "action": "show_contact_form"
    }
  ]
}
```

---

## File Upload

### Upload Image

**POST** `/api/upload/image`

Upload an image (profile, cover, etc.).

**Request:** `multipart/form-data`
- `file`: File (image file, max 5MB)
- `folder`: string (optional, Cloudinary folder)

**Response:** `200 OK`
```json
{
  "url": "https://cloudinary.com/image.jpg",
  "publicId": "folder/image_id",
  "width": 800,
  "height": 600
}
```

---

### Upload Document

**POST** `/api/upload/document`

Upload a PDF or document.

**Request:** `multipart/form-data`
- `file`: File (PDF, max 10MB)
- `folder`: string (optional)

**Response:** `200 OK`
```json
{
  "url": "https://cloudinary.com/document.pdf",
  "publicId": "folder/document_id",
  "pages": 10,
  "size": 1024000
}
```

---

### Upload Video

**POST** `/api/upload/video`

Upload a video.

**Request:** `multipart/form-data`
- `file`: File (video, max 100MB)
- `folder`: string (optional)

**Response:** `200 OK`
```json
{
  "url": "https://cloudinary.com/video.mp4",
  "publicId": "folder/video_id",
  "duration": 3600,
  "thumbnailUrl": "https://cloudinary.com/thumbnail.jpg"
}
```

---

## Common Query Parameters

Most list endpoints support these query parameters:

- `page`: number (default: 1) - Page number
- `limit`: number (default: 20, max: 100) - Items per page
- `search`: string - Search query
- `sort`: string - Sort field and direction (e.g., `createdAt:desc`)
- `filter`: string - JSON stringified filter object

**Example:**
```
GET /api/teacher/classes?page=1&limit=20&search=mathematics&sort=createdAt:desc
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional additional details */ }
  }
}
```

### Common Error Codes

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate enrollment)
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Example Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "password": "Password must be at least 8 characters"
      }
    }
  }
}
```

---

## Rate Limiting

- **Auth endpoints**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **File upload**: 10 requests per minute per user
- **Public endpoints**: 60 requests per minute per IP

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## WebSocket Events (Socket.io)

### Client → Server

- `join:conversation` - Join a conversation room
- `leave:conversation` - Leave a conversation room
- `message:send` - Send a message
- `typing:start` - Indicate typing started
- `typing:stop` - Indicate typing stopped
- `message:read` - Mark message as read

### Server → Client

- `message:new` - New message received
- `message:read` - Message read receipt
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `notification:new` - New notification
- `session:created` - New session created
- `session:updated` - Session updated
- `session:cancelled` - Session cancelled
- `attendance:marked` - Attendance marked

---

## Notes

- All dates are in ISO 8601 format (UTC)
- File uploads use `multipart/form-data`
- Pagination uses 1-based page numbers
- Maximum file sizes:
  - Images: 5MB
  - Documents: 10MB
  - Videos: 100MB
- JWT tokens expire:
  - Access token: 15 minutes
  - Refresh token: 7 days
