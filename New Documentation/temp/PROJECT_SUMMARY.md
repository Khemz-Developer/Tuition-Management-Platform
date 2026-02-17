# Tuition Management Platform - Project Summary

## Overview

A comprehensive, production-ready Tuition Management Platform designed to connect teachers, students, and administrators in a seamless educational ecosystem. The platform includes three main components: Admin + Teacher Portal, Student Portal, and Public Teacher Profile Websites with optional AI Assistant for lead capture.

The platform features a **Teacher-Specific Student Registration** system where students can discover teachers, view their public profiles, and register directly through teacher-specific pages, creating a more personalized and streamlined registration experience.

**Student Registration Flow:**
```
Student → Browse Teachers → Select Teacher → View Teacher's Public Page → 
Register with Teacher → Auto-linked to Teacher → Teacher Manages Students
```

---

## Key Features

### 🎯 Core Functionality

- **Multi-Role System**: Super Admin, Teacher, and Student roles with distinct permissions
- **Teacher Application Workflow**: Approval system for teacher onboarding (PENDING → APPROVED/REJECTED)
- **Teacher-Specific Student Registration**: Students can browse teachers, view public profiles, and register directly through teacher-specific pages with auto-linking
- **Class Management**: Create, manage, and organize tuition batches with scheduling rules
- **Student Enrollment**: Request-based enrollment with approval workflow (auto-approve option)
- **Content Management**: Hierarchical content structure (Units → Lessons → Materials)
- **Session Scheduling**: One-time and recurring class sessions with calendar integration
- **Attendance Tracking**: Mark and track student attendance per session (PRESENT/ABSENT/LATE)
- **Real-time Messaging**: Class chats, announcements, direct messages with read receipts
- **Analytics Dashboards**: Role-specific dashboards with insights and metrics
- **Public Teacher Websites**: SEO-optimized, customizable teacher profile pages at `/t/{teacherSlug}`
- **AI Assistant**: Intelligent chat widget for public teacher pages with lead capture

---

## Teacher-Specific Student Registration Plan

This platform implements a teacher-specific registration system where students can register directly through teacher-specific public pages. This enables a more personalized and streamlined registration experience.

### Key Features

- **Public Teacher Websites**: Each teacher has a public-facing website at `/t/:teacherSlug` showcasing their profile, classes, subjects, and bio
- **Teacher Browsing**: Students can browse and search teachers by subject, grade, and location at `/teachers`
- **Teacher-Linked Registration**: Registration form includes teacher context, automatically linking students to teachers during registration
- **Multi-Teacher Support**: Students can register with multiple teachers for different subjects
- **Teacher Dashboard**: Teachers can view and manage all students registered through their page in a dedicated "My Students" section

### Architecture Components

1. **Public Teacher Website** (`/t/:teacherSlug`)
   - Public-facing page showing teacher profile, classes, subjects, bio
   - "Register with this Teacher" button
   - Customizable by teacher (theme, sections, content)

2. **Teacher Browsing Page** (`/teachers` or `/browse-teachers`)
   - List of all approved teachers
   - Search and filter by subject, grade, location
   - Teacher cards with key information

3. **Teacher-Linked Registration**
   - Registration form accepts optional `teacherId` or `teacherSlug` from URL params
   - Student account automatically linked to teacher during registration
   - Teacher context shown during registration process

4. **Teacher Dashboard Enhancement**
   - "My Students" section showing all students registered through their page
   - Student details (name, email, grade, registration date)
   - Enrollment status per class
   - Quick actions (approve enrollment, send message)

### User Flows

**Flow 1: Student Discovers Teacher and Registers**
1. Student visits `/teachers` (browse teachers page)
2. Student searches/filters teachers by subject/grade
3. Student clicks on a teacher card
4. Student views teacher's public page at `/t/:teacherSlug`
5. Student clicks "Register with this Teacher"
6. Student redirected to `/register/:teacherSlug`
7. Registration form shows teacher context
8. Student fills registration form
9. On submit, registration includes `teacherSlug`
10. Backend links student to teacher
11. Student redirected to dashboard
12. Teacher can see new student in "My Students"

**Flow 2: Direct Teacher Link Registration**
1. Teacher shares their public page link: `/t/:teacherSlug`
2. Student visits link directly
3. Student views teacher profile
4. Student clicks "Register with this Teacher"
5. Registration process continues with teacher context

**Flow 3: Student Registers with Multiple Teachers**
1. Student registers with Teacher A (Math)
2. Student later visits Teacher B's page (Physics)
3. Student registers with Teacher B
4. Both teachers appear in student's "My Teachers" list
5. Student can enroll in classes from both teachers

### Data Model Changes

**StudentProfile Schema Update:**
- Add `preferredTeachers: ObjectId[]` - Array of teachers student registered with
- Add `registeredWithTeacherAt?: Date` - Timestamp of teacher registration

**Alternative Approach:**
- Create separate `StudentTeacherLink` collection for more detailed relationship tracking

### API Changes

**New/Modified Endpoints:**
- `POST /api/auth/register` - Modified to accept optional `teacherId` or `teacherSlug`
- `GET /api/teacher/students` - Get teacher's registered students (new)
- `GET /api/student/teachers` - Get student's linked teachers (new)
- `GET /api/public/teachers` - List all approved teachers (existing)
- `GET /api/public/teachers/:slug` - Get teacher public profile (existing)

### Security Considerations

- Only allow linking to APPROVED teachers
- Teacher public pages accessible without authentication
- Rate limiting on registration to prevent spam
- Only show public information on teacher pages
- Teachers can only see students who registered with them

### Implementation Checklist

**Backend:**
- Update RegisterDto to include optional teacherId/teacherSlug
- Modify AuthService.register() to handle teacher linking
- Update StudentProfile schema to include preferredTeachers
- Add endpoints for teacher-student relationships
- Add validation for teacher approval status

**Frontend - Student App:**
- Create PublicTeacherProfile page component
- Create Teachers browsing page
- Update Register component to accept teacherSlug param
- Add routes for `/t/:teacherSlug` and `/teachers`
- Update navigation to include "Browse Teachers"

**Frontend - Admin/Teacher App:**
- Create "My Students" page for teachers
- Update teacher dashboard to show student count
- Add student management features

**For detailed implementation plan, architecture diagrams, and complete checklist:** See [TEACHER_SPECIFIC_REGISTRATION_PLAN.md](TEACHER_SPECIFIC_REGISTRATION_PLAN.md).

---

## Architecture

### Monorepo Structure

```
tuition-management-system/
├── apps/
│   ├── web/                   # Single Frontend Application (React Vite)
│   │   └── src/
│   │       ├── admin-teacher-web/  # Admin + Teacher Portal
│   │       └── student-web/        # Student Portal
│   └── api/                   # REST API (NestJS)
├── packages/
│   └── shared/                # Shared types, schemas, utilities
└── docker-compose.yml         # Local development setup
```

### Technology Stack

**Frontend:**
- React 18+ with Vite
- TypeScript
- TailwindCSS + shadcn/ui + DaisyUI
- Smooth UI polish: hover animations, transitions, skeleton loaders, modern forms
- React hooks patterns (custom hooks, data fetching hooks)
- FullCalendar (calendar UI)
- Recharts (charts and analytics)
- Socket.io client (real-time features)

**Backend:**
- **NestJS** (TypeScript framework)
  - Built-in TypeScript support
  - Dependency injection for better code organization
  - Decorators for clean, declarative code
  - Modular architecture (modules, controllers, services)
  - Built-in validation, guards, interceptors, filters
  - Excellent for scalable, enterprise-grade applications
- MongoDB with Mongoose ODM
- JWT access + refresh tokens with bcrypt
- Zod (validation)
- Socket.io server (messaging + notifications)
- Cloudinary (recommended) or AWS S3 (file storage)

**DevOps:**
- Docker & Docker Compose
- Environment-based configuration (.env.example files)
- Seed script for demo data

### Architecture Requirements

- **NestJS Architecture**:
  - Modular structure (modules, controllers, services, DTOs)
  - Dependency injection for testability and maintainability
  - Guards for authentication and authorization (RBAC)
  - Interceptors for request/response transformation
  - Filters for exception handling
  - Pipes for validation
- Role-based access control (RBAC) using NestJS guards
- Clean code structure: controllers, services, repositories, DTO/schemas
- Include audit logs for important admin actions
- Add pagination, filtering, sorting for lists
- Prefer monorepo structure with shared packages

---

## Database Schema Highlights

### Core Collections

1. **User** - Base authentication and role management (role: ADMIN | TEACHER | STUDENT)
2. **TeacherProfile** - Extended teacher profile with approval workflow (status: PENDING|APPROVED|REJECTED, slug, image, bio, subjects, grades, verification fields)
3. **StudentProfile** - Student information and preferences (userId, grade, school, etc.)
4. **Class** - Tuition batches with scheduling rules (teacherId, title, subject, grade, fee optional, capacity, schedule rules, visibility, status)
5. **Enrollment** - Student-class relationships (classId, studentId, status: REQUESTED|APPROVED|REJECTED|REMOVED, joinedAt)
6. **Session** - Scheduled class sessions (classId, startDateTime, endDateTime, recurrenceRule optional, createdBy)
7. **Attendance** - Attendance records per session (sessionId, classId, studentId, status: PRESENT|ABSENT|LATE, markedAt, markedBy)
8. **Unit** - Content units (classId, title, order)
9. **Lesson** - Lessons within units (unitId, title, order, content blocks)
10. **Material** - Lesson materials (lessonId, type: PDF|VIDEO|LINK|IMAGE, url, title, metadata)
11. **Conversation** - Messaging conversations (type: DIRECT|CLASS, classId optional, participants)
12. **Message** - Individual messages (conversationId, senderId, text, attachments, readBy)
13. **Announcement** - Class announcements (classId, title, body, createdAt)
14. **Notification** - In-app notifications (userId, type, payload, readAt)
15. **AdminAuditLog** - Admin action tracking (adminId, action, targetType, targetId, timestamp, metadata)
16. **Lead** - Public page inquiries (from AI assistant or contact forms)

### Key Indexes

- Unique constraints on email, userId, slug
- Compound indexes for enrollment and attendance
- Performance indexes on status, dates, and search fields

---

## API Architecture

### Endpoint Categories

1. **Authentication** (`/api/auth`)
   - Register, login, refresh, logout
   - Password reset flow

2. **Admin** (`/api/admin`)
   - Dashboard, analytics
   - Teacher/student/class management
   - Approval workflows
   - Audit logs
   - Site settings management

3. **Teacher** (`/api/teacher`)
   - Profile management
   - Class CRUD operations
   - Session scheduling
   - Attendance marking
   - Content management (units/lessons/materials)
   - Messaging (class chat, announcements, DMs)
   - Public website customization
   - Lead management

4. **Student** (`/api/student`)
   - Profile management
   - Class browsing and search
   - Enrollment requests
   - Content viewing
   - Calendar and sessions
   - Attendance history
   - Messaging

5. **Public** (`/api/public`)
   - Teacher directory
   - Public teacher profiles (`/t/{teacherSlug}`)
   - Lead capture
   - AI chat

6. **File Upload** (`/api/upload`)
   - Image, document, video uploads

### Query Parameters

All list endpoints support pagination and filtering:
- `?page=1&limit=20&search=...`
- Sorting and filtering options per endpoint

### Authentication

- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 days expiry)
- Token rotation on refresh
- Role-based access control (RBAC)
- Rate limiting for auth endpoints

---

## User Roles & Permissions

### Super Admin

- ✅ Approve/reject teacher applications (with reason)
- ✅ Manage teachers, students, classes, subjects, grades
- ✅ View analytics dashboard: counts, trends, per-teacher metrics
- ✅ Impersonate teacher (optional but recommended)
- ✅ Suspend/ban users
- ✅ Manage site settings (branding, terms, contact, notification templates)
- ✅ Review audit logs

### Teacher (Only After Approval)

- ✅ Manage profile (bio, image, subjects, grades, location, contact options)
- ✅ Create and manage classes (tuition batches)
- ✅ Enroll students (add, invite, approve join requests)
- ✅ Manage lessons (units → lessons → materials)
- ✅ Upload materials: PDF, images, video links or uploaded videos
- ✅ Schedule calendar sessions (one-time + recurring)
- ✅ Mark attendance per session
- ✅ Send messages (class chat + announcements + direct messages)
- ✅ Create announcements and notify students
- ✅ View teacher dashboard analytics per class (student count, attendance %, upcoming sessions, unread messages)
- ✅ Manage public website customization
- ✅ Manage leads/inquiries from public page

### Student

- ✅ Register/login
- ✅ Create profile
- ✅ Browse/search classes and teachers
- ✅ Request enrollment (or join via invite link/code)
- ✅ See enrolled classes
- ✅ See class calendar and upcoming sessions
- ✅ See lesson content/materials
- ✅ See attendance history (read-only)
- ✅ Receive notifications and messages
- ✅ Download PDFs and view videos
- ✅ Access "Student Dashboard" (upcoming classes, new materials, unread messages)

---

## Public Teacher Website Features

### Page Structure (`/t/{teacherSlug}`)

- **Hero Section**: Teacher name, image, tagline, cover image
- **About**: Teacher bio and experience
- **Subjects & Grades**: Teaching areas
- **Public Classes**: List of public classes (only those marked public)
- **Schedule Preview**: Upcoming sessions (optional; only public sessions)
- **Testimonials**: Student testimonials (optional)
- **Contact CTA**: Request to Join / Sign Up / Contact Teacher
- **Highlights**: Badges (e.g., "10+ years experience", "Exam specialist", etc.)

### Customization Options

- Theme color, accent color
- Font pairing (limited safe set)
- Cover image + profile image
- Highlights list (max 6)
- Featured classes ordering
- FAQ items that AI can use

### Privacy & Visibility Controls

Teacher/Admin can control what is public using toggles:
- `showEmail` - Show email address
- `showPhone` - Show phone number
- `showWhatsAppButton` - Show WhatsApp contact button
- `showSchedulePreview` - Show public schedule preview
- `showTestimonials` - Show testimonials section
- `showClassFees` - Show class fees
- `showLocation` - Show location
- `showStudentCount` - Show student count (optional)
- `allowPublicAIChat` - Enable AI assistant widget

**Privacy Rules:**
- Public website must never reveal:
  - Private student names
  - Private class chat
  - Internal notes
  - Teacher private contact info unless enabled

### Public AI Assistant (Student-facing)

- Chat widget on `/t/{teacherSlug}` (enabled by `allowPublicAIChat`)
- Answers questions using ONLY:
  - Public teacher profile fields
  - Public classes
  - Public schedule preview
  - Teacher-provided FAQs
  - Platform policies (public)

**AI Capabilities:**
- "What classes does this teacher teach?"
- "Which days do you have classes?"
- "How do I join?"
- "What grade/subject is available?"

**Lead Capture:**
- Collect student name, grade, contact method (WhatsApp/email), preferred subject
- Create a "Lead/Inquiry" record and notify teacher in dashboard
- Optionally propose available times based on public schedule

**AI Safety + UX Rules:**
- Always show disclaimer: "AI may be inaccurate; confirm with teacher."
- If user asks for private info, AI refuses and offers contact CTA
- Generate short, clear answers with action buttons:
  - "Request to Join"
  - "View Classes"
  - "Contact Teacher"

---

## Security Features

### Authentication & Authorization

- ✅ Password hashing with bcrypt
- ✅ JWT access token + refresh token rotation
- ✅ Role-based access control (RBAC)
- ✅ Route guards and middleware
- ✅ Authorization checks: teacher can only access own classes, etc.

### Data Protection

- ✅ Input validation everywhere (Zod schemas)
- ✅ SQL injection prevention (MongoDB parameterized queries)
- ✅ XSS prevention (input sanitization)
- ✅ File upload validation (type/size)
- ✅ Secure file storage (Cloudinary signed URLs)

### API Security

- ✅ Rate limiting for auth endpoints
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Request size limits
- ✅ Audit logging for admin actions
- ✅ Logging and error handling (centralized)

---

## Development Phases

1. **Phase 1**: Project scaffolding and setup
2. **Phase 2**: Database and authentication
3. **Phase 3**: Core entities and CRUD operations
4. **Phase 4**: Admin portal
5. **Phase 5**: Teacher portal
6. **Phase 6**: Student portal
7. **Phase 7**: Public teacher website
8. **Phase 8**: Real-time features (Socket.io)
9. **Phase 9**: AI assistant integration
10. **Phase 10**: Polish and testing
11. **Phase 11**: Deployment preparation

**Estimated Timeline**: 9-12 weeks for a single developer

---

## File Structure

### Root Monorepo Structure

```
tuition-management-system/
├── apps/
│   ├── web/                   # Single Frontend Application (React Vite)
│   │   └── src/
│   │       ├── admin-teacher-web/  # Admin + Teacher Portal
│   │       └── student-web/       # Student Portal
│   └── api/                   # REST API (NestJS)
├── packages/
│   └── shared/                # Shared types, Zod schemas, utilities
├── docker-compose.yml         # Local development setup
├── .env.example              # Root environment template
├── .gitignore
├── package.json              # Root workspace config
├── tsconfig.json             # Base TypeScript config
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

### Backend API (`apps/api/`)

```
api/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── auth/                      # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── refresh-token.strategy.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   │
│   ├── admin/                     # Admin endpoints
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   ├── admin.module.ts
│   │   ├── dto/
│   │   │   ├── approve-teacher.dto.ts
│   │   │   ├── update-user-status.dto.ts
│   │   │   └── site-settings.dto.ts
│   │   └── analytics/
│   │       └── analytics.service.ts
│   │
│   ├── teacher/                   # Teacher endpoints
│   │   ├── teacher.controller.ts
│   │   ├── teacher.service.ts
│   │   ├── teacher.module.ts
│   │   ├── dto/
│   │   │   ├── create-class.dto.ts
│   │   │   ├── update-profile.dto.ts
│   │   │   ├── create-session.dto.ts
│   │   │   ├── mark-attendance.dto.ts
│   │   │   └── website-customization.dto.ts
│   │   ├── website/
│   │   │   ├── website.controller.ts
│   │   │   ├── website.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── update-website-config.dto.ts
│   │   │   │   ├── reorder-sections.dto.ts
│   │   │   │   └── section-config.dto.ts
│   │   ├── classes/
│   │   │   ├── classes.controller.ts
│   │   │   └── classes.service.ts
│   │   ├── sessions/
│   │   │   ├── sessions.controller.ts
│   │   │   └── sessions.service.ts
│   │   ├── attendance/
│   │   │   ├── attendance.controller.ts
│   │   │   └── attendance.service.ts
│   │   ├── content/
│   │   │   ├── content.controller.ts
│   │   │   └── content.service.ts
│   │   └── leads/
│   │       ├── leads.controller.ts
│   │       └── leads.service.ts
│   │
│   ├── student/                   # Student endpoints
│   │   ├── student.controller.ts
│   │   ├── student.service.ts
│   │   ├── student.module.ts
│   │   ├── dto/
│   │   │   ├── enrollment-request.dto.ts
│   │   │   └── update-profile.dto.ts
│   │   ├── enrollments/
│   │   │   ├── enrollments.controller.ts
│   │   │   └── enrollments.service.ts
│   │   └── dashboard/
│   │       └── dashboard.service.ts
│   │
│   ├── public/                    # Public endpoints
│   │   ├── public.controller.ts
│   │   ├── public.service.ts
│   │   ├── public.module.ts
│   │   ├── dto/
│   │   │   └── lead-capture.dto.ts
│   │   ├── teachers/
│   │   │   └── public-teachers.controller.ts
│   │   └── ai/
│   │       ├── ai.controller.ts
│   │       └── ai.service.ts
│   │
│   ├── upload/                    # File upload endpoints
│   │   ├── upload.controller.ts
│   │   ├── upload.service.ts
│   │   ├── upload.module.ts
│   │   └── config/
│   │       └── cloudinary.config.ts
│   │
│   ├── messaging/                 # Messaging module
│   │   ├── messaging.controller.ts
│   │   ├── messaging.service.ts
│   │   ├── messaging.module.ts
│   │   ├── dto/
│   │   │   ├── send-message.dto.ts
│   │   │   └── create-announcement.dto.ts
│   │   └── gateways/
│   │       └── messaging.gateway.ts  # Socket.io gateway
│   │
│   ├── notifications/             # Notifications module
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── notifications.module.ts
│   │
│   ├── models/                    # Mongoose models
│   │   ├── user.model.ts
│   │   ├── teacher-profile.model.ts
│   │   ├── student-profile.model.ts
│   │   ├── class.model.ts
│   │   ├── enrollment.model.ts
│   │   ├── session.model.ts
│   │   ├── attendance.model.ts
│   │   ├── unit.model.ts
│   │   ├── lesson.model.ts
│   │   ├── material.model.ts
│   │   ├── conversation.model.ts
│   │   ├── message.model.ts
│   │   ├── announcement.model.ts
│   │   ├── notification.model.ts
│   │   ├── admin-audit-log.model.ts
│   │   └── lead.model.ts
│   │
│   ├── services/                  # Shared business logic
│   │   ├── email.service.ts
│   │   ├── file-storage.service.ts
│   │   ├── ai.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── guards/                    # Auth guards
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── rbac.guard.ts
│   │
│   ├── decorators/                # Custom decorators
│   │   ├── roles.decorator.ts
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   │
│   ├── interceptors/              # Request/response interceptors
│   │   ├── transform.interceptor.ts
│   │   └── logging.interceptor.ts
│   │
│   ├── filters/                   # Exception filters
│   │   ├── http-exception.filter.ts
│   │   └── validation.filter.ts
│   │
│   ├── middleware/                # NestJS middleware
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   └── rate-limit.middleware.ts
│   │
│   ├── config/                    # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── cors.config.ts
│   │   └── env.config.ts
│   │
│   └── utils/                     # Utility functions
│       ├── pagination.util.ts
│       ├── validation.util.ts
│       ├── date.util.ts
│       └── slug.util.ts
│
├── test/                          # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/                       # Utility scripts
│   ├── seed.ts                    # Database seed script
│   └── migrate.ts
│
├── .env.example
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── nest-cli.json                  # NestJS CLI config
├── package.json
└── README.md
```

---

### Frontend Application (`apps/web/`)

**Single Frontend Application Structure with Separate Admin/Teacher and Student Folders:**

```
web/
├── src/
│   ├── main.tsx                   # Application entry point
│   ├── App.tsx                    # Root component with routing
│   ├── index.css                  # Global styles
│   │
│   ├── admin-teacher-web/         # Admin + Teacher Portal
│   │   ├── components/            # Reusable components
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── ChartCard.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   ├── forms/
│   │   │   │   ├── ClassForm.tsx
│   │   │   │   ├── SessionForm.tsx
│   │   │   │   ├── AttendanceForm.tsx
│   │   │   │   └── ProfileForm.tsx
│   │   │   ├── tables/
│   │   │   │   ├── TeachersTable.tsx
│   │   │   │   ├── StudentsTable.tsx
│   │   │   │   └── ClassesTable.tsx
│   │   │   ├── calendar/
│   │   │   │   └── SessionCalendar.tsx
│   │   │   ├── messaging/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   └── AnnouncementForm.tsx
│   │   │   └── content/
│   │   │       ├── UnitBuilder.tsx
│   │   │       ├── LessonEditor.tsx
│   │   │       └── MaterialUpload.tsx
│   │   │
│   │   ├── pages/                 # Route pages
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Teachers/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── Students/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Classes/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Settings/
│   │   │   │   │   └── index.tsx
│   │   │   │   └── AuditLogs/
│   │   │   │       └── index.tsx
│   │   │   └── teacher/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── Classes/
│   │   │       │   ├── index.tsx
│   │   │       │   ├── [id]/
│   │   │       │   │   ├── Students.tsx
│   │   │       │   │   ├── Calendar.tsx
│   │   │       │   │   ├── Attendance.tsx
│   │   │       │   │   └── Content.tsx
│   │   │       │   └── Create.tsx
│   │   │       ├── Sessions/
│   │   │       │   └── index.tsx
│   │   │       ├── Attendance/
│   │   │       │   └── index.tsx
│   │   │       ├── Content/
│   │   │       │   └── index.tsx
│   │   │       ├── Messages/
│   │   │       │   └── index.tsx
│   │   │       ├── Profile/
│   │   │       │   ├── index.tsx
│   │   │       │   └── Website/
│   │   │       │       ├── index.tsx          # Website customization dashboard
│   │   │       │       ├── Theme.tsx          # Theme customization tab
│   │   │       │       ├── Sections.tsx       # Section builder (drag & drop)
│   │   │       │       ├── Content.tsx        # Content editor tab
│   │   │       │       └── Preview.tsx        # Live preview tab
│   │   │       └── Leads/
│   │   │           └── index.tsx
│   │   │
│   │   ├── layouts/               # Layout components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── TeacherLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   │   ├── useClasses.ts
│   │   │   ├── useSessions.ts
│   │   │   ├── useMessages.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── usePagination.ts
│   │   │
│   │   ├── contexts/              # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── SocketContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── services/              # API services
│   │   │   ├── api.ts             # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── teacher.service.ts
│   │   │   ├── classes.service.ts
│   │   │   ├── sessions.service.ts
│   │   │   ├── attendance.service.ts
│   │   │   ├── content.service.ts
│   │   │   ├── messaging.service.ts
│   │   │   └── upload.service.ts
│   │   │
│   │   ├── types/                 # TypeScript types
│   │   │   ├── user.types.ts
│   │   │   ├── class.types.ts
│   │   │   ├── session.types.ts
│   │   │   ├── message.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   ├── formatDate.ts
│   │   │   ├── formatCurrency.ts
│   │   │   ├── validate.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── routes/                # Route configuration
│   │       ├── index.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── AdminRoute.tsx
│   │
│   ├── student-web/               # Student Portal
│   │   ├── components/            # Reusable components
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── UpcomingSessions.tsx
│   │   │   │   ├── NewMaterials.tsx
│   │   │   │   └── UnreadMessages.tsx
│   │   │   ├── classes/
│   │   │   │   ├── ClassCard.tsx
│   │   │   │   ├── ClassSearch.tsx
│   │   │   │   └── EnrollmentRequest.tsx
│   │   │   ├── calendar/
│   │   │   │   └── StudentCalendar.tsx
│   │   │   ├── content/
│   │   │   │   ├── LessonViewer.tsx
│   │   │   │   ├── MaterialViewer.tsx
│   │   │   │   └── ContentNavigation.tsx
│   │   │   ├── attendance/
│   │   │   │   └── AttendanceHistory.tsx
│   │   │   └── messaging/
│   │   │       ├── ChatWindow.tsx
│   │   │       └── MessageList.tsx
│   │   │
│   │   ├── pages/                 # Route pages
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Classes/
│   │   │   │   ├── index.tsx      # Browse/search classes
│   │   │   │   └── [id].tsx       # Class details + request join
│   │   │   ├── MyClasses/
│   │   │   │   ├── index.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── Materials.tsx
│   │   │   │       ├── Calendar.tsx
│   │   │   │       ├── Attendance.tsx
│   │   │   │       └── Messages.tsx
│   │   │   ├── Messages/
│   │   │   │   └── index.tsx
│   │   │   ├── Profile/
│   │   │   │   └── index.tsx
│   │   │   ├── Teachers/          # Teacher browsing page
│   │   │   │   └── index.tsx
│   │   │   └── Public/            # Public teacher pages
│   │   │       └── TeacherProfile.tsx
│   │   │
│   │   ├── layouts/               # Layout components
│   │   │   ├── StudentLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   │   ├── useClasses.ts
│   │   │   ├── useEnrollments.ts
│   │   │   ├── useMessages.ts
│   │   │   └── useNotifications.ts
│   │   │
│   │   ├── contexts/              # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── SocketContext.tsx
│   │   │
│   │   ├── services/              # API services
│   │   │   ├── api.ts             # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── student.service.ts
│   │   │   ├── classes.service.ts
│   │   │   ├── enrollments.service.ts
│   │   │   ├── content.service.ts
│   │   │   └── messaging.service.ts
│   │   │
│   │   ├── types/                 # TypeScript types
│   │   │   ├── user.types.ts
│   │   │   ├── class.types.ts
│   │   │   └── enrollment.types.ts
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   ├── formatDate.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── routes/                # Route configuration
│   │       ├── index.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── shared/                    # Shared code between portals
│   │   ├── components/            # Shared components
│   │   ├── hooks/                 # Shared hooks
│   │   ├── utils/                 # Shared utilities
│   │   └── types/                 # Shared types
│   │
│   ├── lib/                       # Third-party configs (shared)
│   │   ├── socket.ts              # Socket.io client
│   │   ├── queryClient.ts         # React Query setup
│   │   └── utils.ts               # shadcn/ui utils
│   │
│   └── routes/                    # Main route configuration
│       ├── index.tsx              # Combined routes
│       ├── ProtectedRoute.tsx
│       └── AdminRoute.tsx
│
├── public/
│   ├── favicon.ico
│   └── assets/
│
├── .env.example
├── .env
├── .gitignore
├── Dockerfile
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

### Shared Package (`packages/shared/`)

```
shared/
├── src/
│   ├── types/                     # Shared TypeScript types
│   │   ├── user.types.ts
│   │   ├── class.types.ts
│   │   ├── session.types.ts
│   │   ├── enrollment.types.ts
│   │   ├── message.types.ts
│   │   ├── notification.types.ts
│   │   └── api.types.ts
│   │
│   ├── schemas/                   # Zod validation schemas
│   │   ├── user.schema.ts
│   │   ├── class.schema.ts
│   │   ├── session.schema.ts
│   │   ├── enrollment.schema.ts
│   │   └── message.schema.ts
│   │
│   ├── constants/                 # Shared constants
│   │   ├── roles.ts
│   │   ├── statuses.ts
│   │   ├── permissions.ts
│   │   └── routes.ts
│   │
│   └── utils/                     # Shared utilities
│       ├── validation.ts
│       ├── formatting.ts
│       └── helpers.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

### Public Teacher Website (Flexible Component-Based System)

**Architecture Approach**: Component-based rendering with database-driven configuration for maximum flexibility.

```
apps/public-teacher-web/  (or served from API)
├── src/
│   ├── app/
│   │   ├── t/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Dynamic page renderer
│   │   └── teachers/
│   │       └── page.tsx           # Teacher directory
│   │
│   ├── components/
│   │   ├── sections/              # Reusable section components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SubjectsSection.tsx
│   │   │   ├── ClassesSection.tsx
│   │   │   ├── ScheduleSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── HighlightsSection.tsx
│   │   │   ├── ContactCTASection.tsx
│   │   │   └── CustomSection.tsx  # For custom HTML/content
│   │   │
│   │   ├── layout/
│   │   │   ├── PageLayout.tsx     # Main layout wrapper
│   │   │   └── SectionContainer.tsx
│   │   │
│   │   ├── widgets/
│   │   │   └── AIChatWidget.tsx
│   │   │
│   │   └── ui/                     # UI components
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   │
│   ├── lib/
│   │   ├── renderer/
│   │   │   ├── PageRenderer.tsx   # Dynamic section renderer
│   │   │   └── SectionFactory.tsx # Maps section types to components
│   │   ├── themes/
│   │   │   └── applyTheme.ts      # Applies teacher's theme
│   │   └── api.ts
│   │
│   └── types/
│       └── website.types.ts        # Website config types
│
# Database Schema Extension (in TeacherProfile or separate WebsiteConfig)
```

**Database Schema for Website Customization:**

```typescript
// Add to TeacherProfile model or create separate WebsiteConfig model
websiteConfig: {
  // Theme Customization
  theme: {
    primaryColor: string (hex, default: '#3b82f6')
    accentColor: string (hex, default: '#8b5cf6')
    fontPairing: 'default' | 'modern' | 'classic' | 'elegant' (default: 'default')
    customCSS: string (optional, max 5000 chars) // Limited custom CSS
  }
  
  // Section Configuration (Order & Visibility)
  sections: [
    {
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
    }
  ]
  
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
    // ... other sections
  }
  
  // SEO
  seo: {
    metaTitle: string (optional)
    metaDescription: string (optional)
    metaKeywords: string[] (optional)
    ogImage: string (optional, Cloudinary URL)
  }
}
```

**How It Works:**

1. **Dynamic Rendering System**
   - Page fetches teacher profile + websiteConfig from API
   - `PageRenderer` component reads `sections` array
   - Renders sections in order based on `order` field
   - Only renders sections where `visible: true`
   - Applies theme colors and fonts dynamically

2. **Section Management**
   - Each section is a self-contained React component
   - Sections receive their config from `sections[].config`
   - Sections can be reordered by changing `order` value
   - Sections can be hidden by setting `visible: false`

3. **Teacher Dashboard Interface**
   ```
   /teacher/profile/website
   ├── Theme Customization Tab
   │   ├── Color pickers (primary, accent)
   │   ├── Font selector
   │   └── Custom CSS editor (limited)
   │
   ├── Sections Tab (Drag & Drop Builder)
   │   ├── Available sections list
   │   ├── Active sections (reorderable)
   │   ├── Section visibility toggles
   │   └── Section-specific settings
   │
   ├── Content Tab
   │   ├── Hero content editor
   │   ├── About content editor (rich text)
   │   ├── Custom sections content
   │   └── SEO settings
   │
   └── Preview Tab
       └── Live preview of public page
   ```

4. **Default Section Order** (if not customized):
   ```
   0. Hero
   1. About
   2. Highlights
   3. Subjects & Grades
   4. Public Classes
   5. Schedule Preview (if enabled)
   6. Testimonials (if enabled)
   7. Contact CTA
   ```

5. **Section Types & Config Examples:**
   ```typescript
   // Hero Section
   {
     id: 'hero',
     type: 'hero',
     order: 0,
     visible: true,
     config: {
       showTagline: true,
       showCoverImage: true,
       coverImageOpacity: 0.3,
       ctaButtonText: 'Get Started',
       ctaButtonLink: '#contact'
     }
   }
   
   // Classes Section
   {
     id: 'classes',
     type: 'classes',
     order: 4,
     visible: true,
     config: {
       layout: 'grid', // 'grid' | 'list' | 'carousel'
       itemsPerRow: 3,
       showFees: true,
       showEnrollmentButton: true,
       maxItems: 6
     }
   }
   
   // Custom HTML Section
   {
     id: 'custom-1',
     type: 'custom',
     order: 2,
     visible: true,
     config: {
       htmlContent: '<div>Custom content here</div>',
       backgroundColor: '#f3f4f6',
       padding: 'large'
     }
   }
   ```

6. **API Endpoints:**
   ```
   GET  /api/public/teachers/:slug          # Get public page data
   GET  /api/teacher/website/config         # Get teacher's website config
   PUT  /api/teacher/website/config         # Update website config
   POST /api/teacher/website/sections/reorder # Reorder sections
   ```

**Benefits of This Approach:**

✅ **Flexible**: Teachers can reorder, show/hide, and customize sections  
✅ **Scalable**: Easy to add new section types  
✅ **Maintainable**: Component-based, easy to update  
✅ **Performance**: Only renders visible sections  
✅ **SEO-Friendly**: Server-side rendering with dynamic meta tags  
✅ **User-Friendly**: Drag-and-drop interface in dashboard  
✅ **No Code Required**: Teachers manage everything through UI  

**Implementation Notes:**

- Store `websiteConfig` in `TeacherProfile` model (embedded) or separate `WebsiteConfig` collection
- Use React Context or CSS Variables for theme application
- Implement drag-and-drop using `react-beautiful-dnd` or `@dnd-kit/core`
- Validate section configs using Zod schemas
- Cache rendered pages for performance (optional)
- Support preview mode before publishing changes
- Each teacher's configuration is independent and stored in database

**How Teachers Manage Their Website:**

1. **Access**: Navigate to `/teacher/profile/website` in dashboard
2. **Customize Theme**: Choose colors, fonts, add custom CSS
3. **Arrange Sections**: Drag and drop sections to reorder
4. **Configure Sections**: Click on each section to customize its content and appearance
5. **Edit Content**: Use rich text editors for About, Hero, etc.
6. **Preview**: See live preview before publishing
7. **Publish**: Changes are saved and immediately reflected on public page

**Example: Teacher A vs Teacher B**

- **Teacher A** might want: Hero → Classes → About → Contact (4 sections)
- **Teacher B** might want: Hero → About → Highlights → Subjects → Classes → Schedule → Testimonials → Contact (8 sections)
- **Teacher C** might want: Hero → Custom HTML → Classes → Contact (4 sections, including custom content)

All three configurations are stored independently in the database, and the renderer dynamically builds each page based on the teacher's configuration.

---

## Pages / Routes (Minimum)

**Note:** All routes are in a single frontend application (`apps/web/`) with role-based routing.

### Admin/Teacher Routes

- `/login`, `/register` (shared auth)
- `/admin/dashboard`
- `/admin/teachers` (pending/approved/rejected)
- `/admin/teachers/[id]`
- `/admin/students`
- `/admin/classes`
- `/teacher/dashboard`
- `/teacher/classes`
- `/teacher/classes/[id]/students`
- `/teacher/classes/[id]/calendar`
- `/teacher/classes/[id]/attendance`
- `/teacher/classes/[id]/content` (units/lessons/materials)
- `/teacher/messages`
- `/teacher/profile` (with public website customization)

### Student Routes

- `/login`, `/register` (shared auth)
- `/dashboard`
- `/classes` (browse/search)
- `/classes/[id]` (class details + request join)
- `/my-classes/[id]` (materials + calendar + attendance + messages)
- `/messages`
- `/teachers` (browse teachers directory)
- `/t/[teacherSlug]` (public teacher profile page)

### Public Pages (No Auth Required)

- `/t/[teacherSlug]` (public teacher site)
- `/teachers` (teacher directory page)

---

## Dashboards (UI Requirements)

### Super Admin Dashboard (Modern Cards + Charts)

- Total teachers / pending approvals / total students / total classes
- Per-teacher cards: teacher name, subjects, active classes, total students, attendance avg
- Table views: Teachers list (filter by status), Students list, Classes list
- Drilldown: Teacher detail page with classes and enrolled student counts
- Audit log viewer

### Teacher Dashboard

- Cards: total classes, total students, upcoming sessions, unread messages
- Class overview page: student list, attendance %, next session, latest materials
- Calendar page: create/edit sessions
- Attendance page: mark attendance per session
- Content page: unit/lesson builder + materials upload
- Messaging page: class chat + announcements + DMs
- Analytics per class: student count, attendance %, upcoming sessions, unread messages

### Student Dashboard

- Upcoming sessions this week
- New announcements/materials
- Unread messages
- My classes list + calendar

---

## Key Workflows

### A) Teacher Application & Approval

1. Teacher registers with role "TEACHER"
2. Fills teacher application form
3. Status set to "PENDING"
4. Super Admin reviews teacher details
5. Admin approves or rejects with reason
6. Approved teacher can now create classes and invite/enroll students

### B) Student Registration & Enrollment

1. Student browses teachers at `/teachers` or visits teacher's public page at `/t/:teacherSlug`
2. Student registers with a teacher (teacher-linked registration)
3. Student account is automatically linked to the teacher
4. Student browses/search classes (from their linked teachers or all classes)
5. Student requests enrollment (or joins via invite link/code)
6. Teacher receives notification
7. Teacher approves/denies OR auto-approve if class setting enabled
8. Enrollment creates access to materials, calendar, messages

### C) Calendar & Sessions

1. Teacher creates sessions (single or recurring)
2. Students see sessions in calendar
3. Teacher can update/cancel sessions; students get notifications
4. Session occurs

### D) Attendance

1. After session, teacher marks attendance
2. Attendance summary shown in teacher dashboard + student portal

### E) Messaging

1. Class chat per class
2. Direct messages teacher↔student (optional)
3. Announcement channel (teacher → all enrolled students)
4. Include realtime updates + message read receipts (basic)

### F) Content (Units → Lessons → Materials)

1. Teacher creates units/lessons
2. Add rich content blocks (text, headings, bullet lists, embeds)
3. Attach PDFs/videos/links
4. Students view lesson-by-lesson content

---

## Deployment Considerations

### Environment Variables

- MongoDB connection string
- JWT secrets (32+ characters)
- Cloudinary credentials
- CORS origins
- Email service credentials
- AI API keys (optional)

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique JWT secrets
- [ ] Configure MongoDB Atlas or managed DB
- [ ] Setup SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Setup email service
- [ ] Configure file upload limits
- [ ] Setup monitoring (Sentry, etc.)
- [ ] Enable rate limiting
- [ ] Setup backup strategy
- [ ] Configure CDN for static assets
- [ ] Setup logging and error tracking

### Recommended Hosting

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Railway, Render, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Real-time**: Socket.io (self-hosted) or Pusher

---

## Deliverables

1. **Detailed Implementation Plan** - Step-by-step phases (scaffold → auth → core entities → dashboards → realtime → polish)
2. **Database Schema Models** - Mongoose models with indexes and references
3. **Backend API Code** - Controllers/services with clean code structure
4. **Frontend React Code** - Pages, layouts, route guards, dashboards (React Vite)
5. **Seed Script** - Demo data (admin, 2 teachers, 20 students, sample class, sessions, lessons)
6. **Environment Configuration** - `.env.example` for each app
7. **Docker Setup** - Docker Compose for local dev (api + mongo + web apps)
8. **README** - Complete setup instructions
9. **Documentation** - API routes, database schema, implementation phases

---

## Testing Strategy

### Unit Tests

- Auth service tests
- Core service tests
- Utility function tests
- Component tests (React)

### Integration Tests

- API endpoint tests
- Database operations
- Authentication flows
- File upload tests
- Basic unit/integration tests for auth and core endpoints

### E2E Tests (Optional)

- Critical user flows
- Teacher approval workflow
- Student enrollment flow
- Session creation and attendance

---

## Performance Considerations

### Database

- Proper indexing on frequently queried fields
- Compound indexes for multi-field queries
- Pagination for large datasets
- Aggregation pipelines for analytics

### API

- Response caching where appropriate
- Rate limiting to prevent abuse
- Request size limits
- Efficient query patterns

### Frontend

- Code splitting and lazy loading
- Image optimization
- API response caching (React Query)
- Debouncing search inputs

---

## Design Style

- Modern "SaaS dashboard" look
- Responsive for mobile and desktop
- Use consistent components, empty states, loading skeletons, toast notifications
- Smooth UI polish: hover animations, transitions, skeleton loaders, modern forms

---

## Future Enhancements

- [ ] Mobile apps (React Native)
- [ ] Payment integration (Stripe, Razorpay)
- [ ] Video conferencing (Zoom, Jitsi)
- [ ] Advanced analytics
- [ ] Email/SMS notifications
- [ ] Multi-language support (i18n)
- [ ] White-label customization
- [ ] Advanced search (Elasticsearch)
- [ ] Video streaming for lessons
- [ ] Assignment and grading system
- [ ] Parent portal
- [ ] Certificate generation

---

## Assumptions

If anything is not specified, make reasonable assumptions and document them in README.

---

## Documentation Files

1. **README.md** - Main project documentation
2. **IMPLEMENTATION_PHASES.md** - Detailed development phases
3. **DATABASE_SCHEMA.md** - Complete database schema
4. **API_ROUTES.md** - Full API documentation
5. **SETUP_GUIDE.md** - Step-by-step setup instructions
6. **PROJECT_SUMMARY.md** - This file

---

## Quick Start

1. Clone repository
2. Install dependencies (`npm install`)
3. Setup MongoDB (local or Atlas)
4. Configure `.env` files
5. Run seed script (`npm run seed`)
6. Start development servers
7. Access the application at http://localhost:5173 (single frontend with role-based routing)

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

---

## Support & Resources

- **API Documentation**: See [API_ROUTES.md](./API_ROUTES.md)
- **Database Schema**: See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Setup Instructions**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Implementation Plan**: See [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md)

---

## License

[Specify your license]

---

**Last Updated**: [Current Date]
