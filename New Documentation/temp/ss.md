# Tuition Management Platform (Admin + Teacher + Student + Public Teacher Pages)

A production-ready **Tuition Management Platform** with three roles (**Super Admin**, **Teacher**, **Student**) plus a **public, shareable teacher website** at `/t/{teacherSlug}` (SEO-friendly) including an optional **Public AI Assistant** for student inquiries and lead capture.

---

## Goals

Build a full web platform with:

1. **Admin + Teacher Portal** (web app)
2. **Student Portal** (web app)
3. **Public Teacher Profile Website pages** (shareable URL per teacher)

---

## Tech Stack (Must Use)

### Frontend (both web apps)
- **React (Vite)** + **TypeScript**
- **TailwindCSS**
- **shadcn/ui** + **daisyUI**
- Smooth UI polish: hover animations, transitions, skeleton loaders, modern forms
- React hooks patterns everywhere (custom hooks, data fetching hooks)

### Backend
- **Node.js + TypeScript**
- Choose **ONE** and use consistently:
  - ✅ Recommended: **NestJS** (structured, scalable)
  - Alternative: Express (if you prefer lighter)
- **MongoDB** + **Mongoose ODM**

### Core Libraries / Services
- Auth: **JWT access + refresh tokens** + **bcrypt**
- Validation: **Zod**
- File storage: **Cloudinary** (recommended) OR AWS S3
- Realtime: **Socket.io** for messaging + notifications
- Calendar UI: **FullCalendar**
- Charts: **Recharts**
- Deployment-ready: **Dockerfile**, **docker-compose**, `.env.example`, **seed script**

---

## Monorepo Architecture

Preferred structure:

/apps
/admin-teacher-web # React Vite app (Admin + Teacher portal)
/student-web # React Vite app (Student portal)
/api # Node.js API (NestJS recommended)
/packages
/shared # shared types, zod schemas, utilities



### Architecture Requirements
- Role-Based Access Control (RBAC) via middleware/guards
- Clean structure: controllers/routes, services, repositories, DTO/schemas
- Audit logs for important admin actions
- Pagination, filtering, sorting on list endpoints
- Centralized error handling + structured logging

---

## Roles & Permissions

### 1) Super Admin
- Approve / reject **teacher applications**
- Manage teachers, students, classes, subjects, grades
- Analytics dashboard: counts, trends, per-teacher metrics
- Impersonate teacher (optional but recommended)
- Suspend/ban users
- Manage site settings (branding, terms, contact, notification templates)
- View admin audit logs

### 2) Teacher (Only after approval)
- Manage profile: bio, image, subjects, grades, location, contact options
- Create/manage classes (tuition batches)
- Enroll students: add/invite/approve join requests
- Manage content: units → lessons → materials
- Upload materials: PDFs, images, video links (or uploaded videos if enabled)
- Create calendar sessions: one-time + recurring
- Mark attendance per session
- Messaging: class chat + announcements + direct messages
- Teacher dashboard analytics: student count, attendance %, upcoming sessions, unread messages

### 3) Student
- Register/login + profile
- Browse/search teachers/classes
- Request enrollment (or join via invite link/code)
- View enrolled classes
- View class calendar + upcoming sessions
- View lessons/materials
- View attendance history (read-only)
- Receive notifications + messages
- Download PDFs + view videos
- Student dashboard: upcoming classes, new materials, unread messages

---

## Public Teacher Website (Shareable URL) + AI Agent

### Route
- Each teacher gets a public page:  
  **`/t/{teacherSlug}`**

### Requirements
- Beautiful, responsive, SEO friendly
  - OpenGraph metadata
  - Proper page titles/descriptions
  - Prefer SSR/prerendering for public pages (SEO) even if the portal apps are SPA

### Public Page Sections (Template)
- Hero: Teacher name, image, tagline, cover image
- About teacher (bio)
- Subjects & grades taught
- Public class list (only those marked public)
- Schedule preview (optional; only public sessions)
- Testimonials (optional)
- Contact CTA: Request to Join / Sign Up / Contact Teacher
- Highlights: badges (e.g., “10+ years experience”, “Exam specialist”)

### Privacy + Visibility Controls
Teacher/Admin can configure public toggles:
- `showEmail`, `showPhone`, `showWhatsAppButton`
- `showSchedulePreview`
- `showTestimonials`
- `showClassFees`
- `showLocation`
- `showStudentCount` (optional)
- `allowPublicAIChat` (optional)

Public website must never reveal:
- student names
- private class chat
- internal notes
- private contact info unless enabled

### Teacher Website Customization
Teacher can customize:
- theme color, accent color, limited safe font pairing set
- cover image + profile image
- highlights list (max 6)
- featured classes ordering
- FAQ items used by AI assistant

---

## Public AI Assistant (Student-Facing Chat Widget)

### Behavior
- Appears on `/t/{teacherSlug}` only if `allowPublicAIChat` is enabled.
- AI assistant must answer using **ONLY**:
  - public teacher profile fields
  - public classes
  - public schedule preview
  - teacher-provided FAQs
  - platform public policies

### Example Questions It Must Answer
- “What classes does this teacher teach?”
- “Which days do you have classes?”
- “How do I join?”
- “What grade/subject is available?”

### Lead Capture
The AI assistant can collect:
- student name
- grade
- contact method (WhatsApp/email)
- preferred subject
- inquiry message

Then:
- Create an `Inquiry/Lead` record
- Notify teacher in their dashboard
- Optionally propose available times based on public schedule

### Safety + UX Rules
- Always show disclaimer: **“AI may be inaccurate; confirm with teacher.”**
- If user asks for private info → refuse and offer CTA options
- Responses should be short, clear, and include action buttons:
  - “Request to Join”
  - “View Classes”
  - “Contact Teacher”

---

## Primary Entities (MongoDB Collections)

Design schemas with indexes and references:

- **User**  
  `role: ADMIN | TEACHER | STUDENT`
- **TeacherProfile**  
  `userId, status: PENDING|APPROVED|REJECTED, slug, image, bio, subjects, grades, verificationFields`
- **StudentProfile**  
  `userId, grade, school, ...`
- **Class**  
  `teacherId, title, subject, grade, fee?, capacity, scheduleRules, visibility, status`
- **Enrollment**  
  `classId, studentId, status: REQUESTED|APPROVED|REJECTED|REMOVED, joinedAt`
- **Session**  
  `classId, startDateTime, endDateTime, recurrenceRule?, createdBy`
- **Attendance**  
  `sessionId, classId, studentId, status: PRESENT|ABSENT|LATE, markedAt, markedBy`
- **Unit**  
  `classId, title, order`
- **Lesson**  
  `unitId, title, order, contentBlocks`
- **Material**  
  `lessonId, type: PDF|VIDEO|LINK|IMAGE, url, title, metadata`
- **Conversation**  
  `type: DIRECT|CLASS, classId?, participants`
- **Message**  
  `conversationId, senderId, text, attachments, readBy`
- **Announcement**  
  `classId, title, body, createdAt`
- **Notification**  
  `userId, type, payload, readAt`
- **AdminAuditLog**  
  `adminId, action, targetType, targetId, timestamp, metadata`

> Note: All lists must support pagination + search + sorting. Add indexes on `teacherId`, `classId`, `studentId`, `slug`, and status fields.

---

## Key Workflows

### A) Teacher Application & Approval
- Teacher registers → fills teacher application form → status `PENDING`
- Super Admin reviews → `APPROVE` or `REJECT` (with reason)
- Approved teacher can create classes and enroll students

### B) Student Enrollment
- Student registers → browses classes → requests enrollment
- Teacher approves/denies OR class can enable auto-approve
- Enrollment grants access to calendar, materials, messages

### C) Calendar & Sessions
- Teacher creates one-time or recurring sessions
- Students see sessions in their calendar
- Teacher can update/cancel sessions → students notified

### D) Attendance
- Teacher marks attendance after session
- Attendance summaries shown in teacher dashboard + student portal

### E) Messaging
- Class chat per class
- Optional direct messages teacher↔student
- Announcements to all enrolled students
- Realtime messaging + basic read receipts

### F) Content (Units → Lessons → Materials)
- Teacher creates units & lessons
- Lessons contain rich content blocks (text, headings, lists, embeds)
- Attach PDFs/videos/links
- Students view lesson-by-lesson content

---

## Dashboards (UI Requirements)

### Super Admin Dashboard
Modern cards + charts:
- Total teachers / pending approvals / total students / total classes
- Per-teacher cards: teacher name, subjects, active classes, total students, attendance avg
- Tables: Teachers list (filter by status), Students list, Classes list
- Drilldown teacher page: classes + enrollment counts
- Audit log viewer

### Teacher Dashboard
- Cards: total classes, total students, upcoming sessions, unread messages
- Class overview: student list, attendance %, next session, latest materials
- Calendar: create/edit sessions
- Attendance: mark per session
- Content: unit/lesson builder + materials upload
- Messaging: class chat + announcements + DMs

### Student Dashboard
- Upcoming sessions this week
- New announcements/materials
- Unread messages
- My classes list + calendar

---

## Security & Quality

- bcrypt password hashing
- JWT access token + refresh token rotation
- Rate limiting for auth endpoints
- Validation everywhere (Zod)
- File upload validation (type/size)
- Strong authorization checks (teacher can only access own classes, etc.)
- Basic tests for auth + core flows
- Centralized logging + consistent error format

---

## Pages / Routes (Minimum)

### Admin/Teacher Web (`/apps/admin-teacher-web`)
- `/login`, `/register`
- `/admin/dashboard`
- `/admin/teachers` (pending/approved/rejected)
- `/admin/teachers/:id`
- `/admin/students`
- `/admin/classes`
- `/teacher/dashboard`
- `/teacher/classes`
- `/teacher/classes/:id/students`
- `/teacher/classes/:id/calendar`
- `/teacher/classes/:id/attendance`
- `/teacher/classes/:id/content`
- `/teacher/messages`

### Student Web (`/apps/student-web`)
- `/login`, `/register`
- `/dashboard`
- `/classes` (browse/search)
- `/classes/:id` (details + request join)
- `/my-classes/:id` (materials + calendar + attendance + messages)
- `/messages`

### Public
- `/t/:teacherSlug` (public teacher site)
- `/teachers` (optional directory)

---

## API Endpoints (REST)

Define clear endpoints for:

- **Auth**: register, login, refresh, logout
- **Admin**: teacher approvals, lists, analytics
- **Teacher**: class CRUD, sessions, attendance, content, messaging
- **Student**: browse classes, enrollment requests, view materials/calendar/messages

All list endpoints support:
- `?page=1&limit=20&search=...`
- `?sort=createdAt:desc` (recommended)
- `?status=APPROVED` etc.

---

## Deliverables (Project Outputs)

1. Detailed implementation plan (phases)
2. Database schema models (Mongoose) + indexes
3. Backend API code with controllers/services
4. Frontend **React Vite** code with pages, layouts, route guards, dashboards
5. Seed script for demo data (admin, 2 teachers, 20 students, sample class, sessions, lessons)
6. `.env.example` for each app
7. Docker compose for local dev (api + mongo + web apps)
8. README setup instructions (this file)

---

## Project Plan (Recommended Phases)

### Phase 1 — Scaffold & Tooling
- Create monorepo structure
- Shared types + zod schemas package
- Linting, formatting, Husky hooks (optional)

### Phase 2 — Auth + RBAC
- Register/login
- JWT access + refresh token rotation
- Role guards and route protection

### Phase 3 — Core Data Models
- Users, teacher profiles, student profiles
- Classes, enrollments
- Admin approval workflow + audit logs

### Phase 4 — Teacher Tools
- Class management
- Calendar sessions (FullCalendar)
- Content builder (units/lessons/materials)
- Upload integration (Cloudinary)

### Phase 5 — Student Portal
- Browse classes
- Enrollment requests
- View calendar + materials
- Notifications

### Phase 6 — Messaging (Socket.io)
- Class chat + announcements
- Realtime notifications + read receipts (basic)

### Phase 7 — Public Teacher Site + AI Assistant
- `/t/:slug` SEO-friendly pages
- Privacy toggles + customization
- AI chat widget + inquiry lead capture

### Phase 8 — Polish & Deployment
- Docker compose + prod builds
- Logging, monitoring, backups guidance
- Basic tests, load checks

---

## Environment Variables

Create `.env` files from the examples below.

### `apps/api/.env.example`
```env
NODE_ENV=development
PORT=4000

MONGO_URI=mongodb://mongo:27017/tuition_platform

JWT_ACCESS_SECRET=replace_me_access_secret
JWT_REFRESH_SECRET=replace_me_refresh_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

BCRYPT_SALT_ROUNDS=10

CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Cloudinary (recommended)
CLOUDINARY_CLOUD_NAME=replace_me
CLOUDINARY_API_KEY=replace_me
CLOUDINARY_API_SECRET=replace_me
CLOUDINARY_FOLDER=tuition-platform

# Socket.io
SOCKET_IO_PATH=/socket.io

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100




### Architecture Requirements
- Role-Based Access Control (RBAC) via middleware/guards
- Clean structure: controllers/routes, services, repositories, DTO/schemas
- Audit logs for important admin actions
- Pagination, filtering, sorting on list endpoints
- Centralized error handling + structured logging

---

## Roles & Permissions

### 1) Super Admin
- Approve / reject **teacher applications**
- Manage teachers, students, classes, subjects, grades
- Analytics dashboard: counts, trends, per-teacher metrics
- Impersonate teacher (optional but recommended)
- Suspend/ban users
- Manage site settings (branding, terms, contact, notification templates)
- View admin audit logs

### 2) Teacher (Only after approval)
- Manage profile: bio, image, subjects, grades, location, contact options
- Create/manage classes (tuition batches)
- Enroll students: add/invite/approve join requests
- Manage content: units → lessons → materials
- Upload materials: PDFs, images, video links (or uploaded videos if enabled)
- Create calendar sessions: one-time + recurring
- Mark attendance per session
- Messaging: class chat + announcements + direct messages
- Teacher dashboard analytics: student count, attendance %, upcoming sessions, unread messages

### 3) Student
- Register/login + profile
- Browse/search teachers/classes
- Request enrollment (or join via invite link/code)
- View enrolled classes
- View class calendar + upcoming sessions
- View lessons/materials
- View attendance history (read-only)
- Receive notifications + messages
- Download PDFs + view videos
- Student dashboard: upcoming classes, new materials, unread messages

---

## Public Teacher Website (Shareable URL) + AI Agent

### Route
- Each teacher gets a public page:  
  **`/t/{teacherSlug}`**

### Requirements
- Beautiful, responsive, SEO friendly
  - OpenGraph metadata
  - Proper page titles/descriptions
  - Prefer SSR/prerendering for public pages (SEO) even if the portal apps are SPA

### Public Page Sections (Template)
- Hero: Teacher name, image, tagline, cover image
- About teacher (bio)
- Subjects & grades taught
- Public class list (only those marked public)
- Schedule preview (optional; only public sessions)
- Testimonials (optional)
- Contact CTA: Request to Join / Sign Up / Contact Teacher
- Highlights: badges (e.g., “10+ years experience”, “Exam specialist”)

### Privacy + Visibility Controls
Teacher/Admin can configure public toggles:
- `showEmail`, `showPhone`, `showWhatsAppButton`
- `showSchedulePreview`
- `showTestimonials`
- `showClassFees`
- `showLocation`
- `showStudentCount` (optional)
- `allowPublicAIChat` (optional)

Public website must never reveal:
- student names
- private class chat
- internal notes
- private contact info unless enabled

### Teacher Website Customization
Teacher can customize:
- theme color, accent color, limited safe font pairing set
- cover image + profile image
- highlights list (max 6)
- featured classes ordering
- FAQ items used by AI assistant

---

## Public AI Assistant (Student-Facing Chat Widget)

### Behavior
- Appears on `/t/{teacherSlug}` only if `allowPublicAIChat` is enabled.
- AI assistant must answer using **ONLY**:
  - public teacher profile fields
  - public classes
  - public schedule preview
  - teacher-provided FAQs
  - platform public policies

### Example Questions It Must Answer
- “What classes does this teacher teach?”
- “Which days do you have classes?”
- “How do I join?”
- “What grade/subject is available?”

### Lead Capture
The AI assistant can collect:
- student name
- grade
- contact method (WhatsApp/email)
- preferred subject
- inquiry message

Then:
- Create an `Inquiry/Lead` record
- Notify teacher in their dashboard
- Optionally propose available times based on public schedule

### Safety + UX Rules
- Always show disclaimer: **“AI may be inaccurate; confirm with teacher.”**
- If user asks for private info → refuse and offer CTA options
- Responses should be short, clear, and include action buttons:
  - “Request to Join”
  - “View Classes”
  - “Contact Teacher”

---

## Primary Entities (MongoDB Collections)

Design schemas with indexes and references:

- **User**  
  `role: ADMIN | TEACHER | STUDENT`
- **TeacherProfile**  
  `userId, status: PENDING|APPROVED|REJECTED, slug, image, bio, subjects, grades, verificationFields`
- **StudentProfile**  
  `userId, grade, school, ...`
- **Class**  
  `teacherId, title, subject, grade, fee?, capacity, scheduleRules, visibility, status`
- **Enrollment**  
  `classId, studentId, status: REQUESTED|APPROVED|REJECTED|REMOVED, joinedAt`
- **Session**  
  `classId, startDateTime, endDateTime, recurrenceRule?, createdBy`
- **Attendance**  
  `sessionId, classId, studentId, status: PRESENT|ABSENT|LATE, markedAt, markedBy`
- **Unit**  
  `classId, title, order`
- **Lesson**  
  `unitId, title, order, contentBlocks`
- **Material**  
  `lessonId, type: PDF|VIDEO|LINK|IMAGE, url, title, metadata`
- **Conversation**  
  `type: DIRECT|CLASS, classId?, participants`
- **Message**  
  `conversationId, senderId, text, attachments, readBy`
- **Announcement**  
  `classId, title, body, createdAt`
- **Notification**  
  `userId, type, payload, readAt`
- **AdminAuditLog**  
  `adminId, action, targetType, targetId, timestamp, metadata`

> Note: All lists must support pagination + search + sorting. Add indexes on `teacherId`, `classId`, `studentId`, `slug`, and status fields.

---

## Key Workflows

### A) Teacher Application & Approval
- Teacher registers → fills teacher application form → status `PENDING`
- Super Admin reviews → `APPROVE` or `REJECT` (with reason)
- Approved teacher can create classes and enroll students

### B) Student Enrollment
- Student registers → browses classes → requests enrollment
- Teacher approves/denies OR class can enable auto-approve
- Enrollment grants access to calendar, materials, messages

### C) Calendar & Sessions
- Teacher creates one-time or recurring sessions
- Students see sessions in their calendar
- Teacher can update/cancel sessions → students notified

### D) Attendance
- Teacher marks attendance after session
- Attendance summaries shown in teacher dashboard + student portal

### E) Messaging
- Class chat per class
- Optional direct messages teacher↔student
- Announcements to all enrolled students
- Realtime messaging + basic read receipts

### F) Content (Units → Lessons → Materials)
- Teacher creates units & lessons
- Lessons contain rich content blocks (text, headings, lists, embeds)
- Attach PDFs/videos/links
- Students view lesson-by-lesson content

---

## Dashboards (UI Requirements)

### Super Admin Dashboard
Modern cards + charts:
- Total teachers / pending approvals / total students / total classes
- Per-teacher cards: teacher name, subjects, active classes, total students, attendance avg
- Tables: Teachers list (filter by status), Students list, Classes list
- Drilldown teacher page: classes + enrollment counts
- Audit log viewer

### Teacher Dashboard
- Cards: total classes, total students, upcoming sessions, unread messages
- Class overview: student list, attendance %, next session, latest materials
- Calendar: create/edit sessions
- Attendance: mark per session
- Content: unit/lesson builder + materials upload
- Messaging: class chat + announcements + DMs

### Student Dashboard
- Upcoming sessions this week
- New announcements/materials
- Unread messages
- My classes list + calendar

---

## Security & Quality

- bcrypt password hashing
- JWT access token + refresh token rotation
- Rate limiting for auth endpoints
- Validation everywhere (Zod)
- File upload validation (type/size)
- Strong authorization checks (teacher can only access own classes, etc.)
- Basic tests for auth + core flows
- Centralized logging + consistent error format

---

## Pages / Routes (Minimum)

### Admin/Teacher Web (`/apps/admin-teacher-web`)
- `/login`, `/register`
- `/admin/dashboard`
- `/admin/teachers` (pending/approved/rejected)
- `/admin/teachers/:id`
- `/admin/students`
- `/admin/classes`
- `/teacher/dashboard`
- `/teacher/classes`
- `/teacher/classes/:id/students`
- `/teacher/classes/:id/calendar`
- `/teacher/classes/:id/attendance`
- `/teacher/classes/:id/content`
- `/teacher/messages`

### Student Web (`/apps/student-web`)
- `/login`, `/register`
- `/dashboard`
- `/classes` (browse/search)
- `/classes/:id` (details + request join)
- `/my-classes/:id` (materials + calendar + attendance + messages)
- `/messages`

### Public
- `/t/:teacherSlug` (public teacher site)
- `/teachers` (optional directory)

---

## API Endpoints (REST)

Define clear endpoints for:

- **Auth**: register, login, refresh, logout
- **Admin**: teacher approvals, lists, analytics
- **Teacher**: class CRUD, sessions, attendance, content, messaging
- **Student**: browse classes, enrollment requests, view materials/calendar/messages

All list endpoints support:
- `?page=1&limit=20&search=...`
- `?sort=createdAt:desc` (recommended)
- `?status=APPROVED` etc.

---

## Deliverables (Project Outputs)

1. Detailed implementation plan (phases)
2. Database schema models (Mongoose) + indexes
3. Backend API code with controllers/services
4. Frontend **React Vite** code with pages, layouts, route guards, dashboards
5. Seed script for demo data (admin, 2 teachers, 20 students, sample class, sessions, lessons)
6. `.env.example` for each app
7. Docker compose for local dev (api + mongo + web apps)
8. README setup instructions (this file)

---

## Project Plan (Recommended Phases)

### Phase 1 — Scaffold & Tooling
- Create monorepo structure
- Shared types + zod schemas package
- Linting, formatting, Husky hooks (optional)

### Phase 2 — Auth + RBAC
- Register/login
- JWT access + refresh token rotation
- Role guards and route protection

### Phase 3 — Core Data Models
- Users, teacher profiles, student profiles
- Classes, enrollments
- Admin approval workflow + audit logs

### Phase 4 — Teacher Tools
- Class management
- Calendar sessions (FullCalendar)
- Content builder (units/lessons/materials)
- Upload integration (Cloudinary)

### Phase 5 — Student Portal
- Browse classes
- Enrollment requests
- View calendar + materials
- Notifications

### Phase 6 — Messaging (Socket.io)
- Class chat + announcements
- Realtime notifications + read receipts (basic)

### Phase 7 — Public Teacher Site + AI Assistant
- `/t/:slug` SEO-friendly pages
- Privacy toggles + customization
- AI chat widget + inquiry lead capture

### Phase 8 — Polish & Deployment
- Docker compose + prod builds
- Logging, monitoring, backups guidance
- Basic tests, load checks

---

## Environment Variables

Create `.env` files from the examples below.

### `apps/api/.env.example`
```env
NODE_ENV=development
PORT=4000

MONGO_URI=mongodb://mongo:27017/tuition_platform

JWT_ACCESS_SECRET=replace_me_access_secret
JWT_REFRESH_SECRET=replace_me_refresh_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

BCRYPT_SALT_ROUNDS=10

CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Cloudinary (recommended)
CLOUDINARY_CLOUD_NAME=replace_me
CLOUDINARY_API_KEY=replace_me
CLOUDINARY_API_SECRET=replace_me
CLOUDINARY_FOLDER=tuition-platform

# Socket.io
SOCKET_IO_PATH=/socket.io

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100


apps/admin-teacher-web/.env.example