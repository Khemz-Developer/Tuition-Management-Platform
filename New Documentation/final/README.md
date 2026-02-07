# Tuition Management Platform - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Implementation Phases](#implementation-phases)
5. [Database Schema](#database-schema)
6. [API Routes](#api-routes)
7. [Features by Role](#features-by-role)
8. [Setup Instructions](#setup-instructions)
9. [Deployment](#deployment)
10. [Security Considerations](#security-considerations)

---

## 🎯 Project Overview

A comprehensive, production-ready Tuition Management Platform designed to connect teachers, students, and administrators in a seamless educational ecosystem. The platform includes:

1. **Admin + Teacher Portal** - Web application for administrators and teachers
2. **Student Portal** - Web application for students
3. **Public Teacher Profile Pages** - Shareable URLs at `/t/{teacherSlug}` with customizable websites and AI assistant

The platform features a **Teacher-Specific Student Registration** system where students can discover teachers, view their public profiles, and register directly through teacher-specific pages, creating a more personalized and streamlined registration experience.

**Student Registration Flow:**
```
Student → Browse Teachers → Select Teacher → View Teacher's Public Page → 
Register with Teacher → Auto-linked to Teacher → Teacher Manages Students
```

### Core Capabilities

- **Role-Based Access Control** (Super Admin, Teacher, Student)
- **Teacher Application & Approval Workflow** (PENDING → APPROVED/REJECTED)
- **Teacher-Specific Student Registration** - Students can browse teachers, view public profiles, and register directly through teacher-specific pages with auto-linking
- **Class Management** (Create, manage, enroll students)
- **Content Management** (Units → Lessons → Materials)
- **Calendar & Session Scheduling** (One-time + Recurring)
- **Attendance Tracking** (PRESENT/ABSENT/LATE per session)
- **Real-time Messaging** (Class chat, announcements, DMs with read receipts)
- **Analytics Dashboards** (Admin, Teacher, Student)
- **Public Teacher Websites** - SEO-optimized, customizable with AI Assistant
- **File Uploads** (PDFs, images, videos via Cloudinary)

---

## 🏗️ Architecture

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
│   └── shared/                # Shared types, Zod schemas, utilities
├── docker-compose.yml         # Local development setup
├── .env.example              # Root environment template
└── README.md
```

> **Note:** The frontend uses a single application architecture with separate folders for admin-teacher-web and student-web within `apps/web/src/`. Public Teacher Website components are split between:
> - **Viewing** (`student-web/components/public-website/`) - sections, layout, widgets, renderer
> - **Managing** (`admin-teacher-web/components/website-builder/`) - ThemeCustomizer, SectionList, SectionEditor

### Technology Decisions

- **Backend Framework**: NestJS (chosen for better structure, decorators, dependency injection)
- **File Storage**: Cloudinary (easier setup, built-in transformations)
- **Real-time**: Socket.io (self-hosted, more control)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui + DaisyUI
- **Animations**: Framer Motion / CSS transitions
- **State Management**: React Query + Zustand
- **Calendar**: FullCalendar
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary SDK
- **Real-time**: Socket.io
- **Rate Limiting**: @nestjs/throttler
- **Logging**: Winston / Pino

### DevOps
- **Containerization**: Docker + Docker Compose
- **Environment**: dotenv
- **Testing**: Jest + Supertest

---

## 📅 Implementation Phases

### Phase 1: Project Scaffolding & Setup (Week 1)
- [x] Initialize monorepo structure
- [x] Setup TypeScript configs
- [x] Configure build tools (Vite, NestJS)
- [x] Setup shared package for types/schemas
- [x] Configure ESLint, Prettier
- [x] Setup Docker Compose (MongoDB, API)
- [x] Create .env.example files

### Phase 2: Database & Authentication (Week 1-2)
- [ ] Design and implement MongoDB schemas
- [ ] Create Mongoose models with indexes
- [ ] Implement JWT authentication (register, login, refresh)
- [ ] Create auth guards/middleware (RBAC)
- [ ] Password hashing with bcrypt
- [ ] Rate limiting for auth endpoints
- [ ] Auth API endpoints + validation

### Phase 3: Core Entities & CRUD (Week 2-3)
- [ ] User management (Admin, Teacher, Student)
- [ ] Teacher Profile (application, approval workflow)
- [ ] Student Profile
- [ ] Class CRUD (create, update, delete, list)
- [ ] Enrollment system (request, approve, reject)
- [ ] Unit/Lesson/Material management
- [ ] Session CRUD (single + recurring)
- [ ] Attendance marking
- [ ] Conversation/Message models

### Phase 4: Admin Portal (Week 3-4)
- [ ] Admin dashboard (analytics, charts)
- [ ] Teacher approval interface
- [ ] Teacher/Student/Class management tables
- [ ] Audit log viewer
- [ ] Site settings management
- [ ] Impersonation feature (optional)

### Phase 5: Teacher Portal (Week 4-5)
- [ ] Teacher dashboard (stats, upcoming sessions)
- [ ] Class management UI
- [ ] Student enrollment management
- [ ] Calendar interface (create/edit sessions)
- [ ] Attendance marking interface
- [ ] Content builder (units/lessons/materials)
- [ ] File upload (Cloudinary integration)
- [ ] Messaging interface (class chat, announcements, DMs)
- [ ] Teacher profile customization

### Phase 6: Student Portal (Week 5-6)
- [ ] Student dashboard (upcoming sessions, new materials)
- [ ] Class browsing/search
- [ ] Enrollment requests
- [ ] Class detail pages (materials, calendar, attendance)
- [ ] Messaging interface
- [ ] Notification center

### Phase 7: Public Teacher Website (Week 6-7)
- [ ] Public teacher profile page (`/t/{slug}`)
- [ ] SEO optimization (OpenGraph, metadata)
- [ ] Responsive design
- [ ] Privacy controls (visibility toggles)
- [ ] Theme customization
- [ ] AI Assistant integration
- [ ] Lead capture form

### Phase 8: Real-time Features (Week 7)
- [ ] Socket.io server setup
- [ ] Real-time messaging
- [ ] Notification system
- [ ] Live attendance updates
- [ ] Online presence indicators

### Phase 9: AI Assistant (Week 7-8)
- [ ] AI chat widget (OpenAI/Anthropic integration)
- [ ] Context management (public data only)
- [ ] Lead capture flow
- [ ] Safety rules & disclaimers
- [ ] FAQ management

### Phase 10: Polish & Testing (Week 8-9)
- [ ] Unit tests (auth, core endpoints)
- [ ] Integration tests
- [ ] E2E tests (critical flows)
- [ ] Error handling improvements
- [ ] Loading states, skeletons
- [ ] Empty states
- [ ] Toast notifications
- [ ] Responsive design fixes
- [ ] Performance optimization

### Phase 11: Deployment Prep (Week 9-10)
- [ ] Dockerfile for each app
- [ ] Docker Compose for production
- [ ] Seed script (demo data)
- [ ] Environment variable documentation
- [ ] Deployment guides (Vercel, Railway, AWS)
- [ ] Monitoring setup (optional)

---

## 🗄️ Database Schema

### User Model
```typescript
{
  _id: ObjectId
  email: string (unique, indexed)
  password: string (hashed)
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  isActive: boolean
  isSuspended: boolean
  lastLoginAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### TeacherProfile Model
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User, unique, indexed)
  status: 'PENDING' | 'APPROVED' | 'REJECTED' (indexed)
  slug: string (unique, indexed)
  image: string (Cloudinary URL)
  coverImage: string (Cloudinary URL)
  bio: string
  tagline: string
  subjects: string[] (indexed)
  grades: string[]
  location: {
    city: string
    state: string
    country: string
  }
  contact: {
    email: string
    phone: string
    whatsapp: string
  }
  visibility: {
    showEmail: boolean
    showPhone: boolean
    showWhatsAppButton: boolean
    showSchedulePreview: boolean
    showTestimonials: boolean
    showClassFees: boolean
    showLocation: boolean
    showStudentCount: boolean
    allowPublicAIChat: boolean
  }
  customization: {
    themeColor: string
    accentColor: string
    fontPairing: string
    highlights: string[] (max 6)
    faqs: Array<{ question: string, answer: string }>
  }
  verification: {
    documents: string[] (Cloudinary URLs)
    verifiedAt: Date
    verifiedBy: ObjectId (ref: User)
  }
  rejectionReason: string
  approvedAt: Date
  approvedBy: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### StudentProfile Model
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User, unique, indexed)
  firstName: string (required)
  lastName: string (required)
  grade: string (indexed)
  school: string
  dateOfBirth: Date
  parentName: string
  parentContact: string
  parentEmail: string
  relationship: string // 'Father', 'Mother', 'Guardian'
  phone: string
  address: string
  preferredSubjects: string[]
  learningGoals: string
  // Teacher Linking (for teacher-specific registration)
  preferredTeachers: ObjectId[] (ref: User, indexed) // Teachers student registered with
  registeredWithTeacherAt: Date // Timestamp of first teacher registration
  createdAt: Date
  updatedAt: Date
}
```

### Class Model
```typescript
{
  _id: ObjectId
  teacherId: ObjectId (ref: User, indexed)
  title: string
  description: string
  subject: string (indexed)
  grade: string (indexed)
  fee: number (optional)
  capacity: number
  currentEnrollment: number
  scheduleRules: {
    daysOfWeek: number[] // 0-6 (Sunday-Saturday)
    startTime: string // HH:mm
    endTime: string // HH:mm
    timezone: string
  }
  visibility: 'PUBLIC' | 'PRIVATE'
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT'
  inviteCode: string (unique, indexed)
  inviteLink: string
  createdAt: Date
  updatedAt: Date
}
```

### Enrollment Model
```typescript
{
  _id: ObjectId
  classId: ObjectId (ref: Class, indexed)
  studentId: ObjectId (ref: User, indexed)
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'REMOVED' (indexed)
  requestedAt: Date
  approvedAt: Date
  approvedBy: ObjectId (ref: User)
  joinedAt: Date
  removedAt: Date
  removedBy: ObjectId (ref: User)
  rejectionReason: string
  createdAt: Date
  updatedAt: Date
}
// Compound index: (classId, studentId) unique
```

### Session Model
```typescript
{
  _id: ObjectId
  classId: ObjectId (ref: Class, indexed)
  title: string
  description: string
  startDateTime: Date (indexed)
  endDateTime: Date (indexed)
  recurrenceRule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
    interval: number
    endDate: Date
    daysOfWeek: number[]
  } | null
  isRecurring: boolean
  parentSessionId: ObjectId (ref: Session) // For recurring instances
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  location: string // Physical or online link
  createdBy: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Attendance Model
```typescript
{
  _id: ObjectId
  sessionId: ObjectId (ref: Session, indexed)
  classId: ObjectId (ref: Class, indexed)
  studentId: ObjectId (ref: User, indexed)
  status: 'PRESENT' | 'ABSENT' | 'LATE'
  markedAt: Date
  markedBy: ObjectId (ref: User)
  notes: string
  createdAt: Date
  updatedAt: Date
}
// Compound index: (sessionId, studentId) unique
```

### Unit Model
```typescript
{
  _id: ObjectId
  classId: ObjectId (ref: Class, indexed)
  title: string
  description: string
  order: number
  createdAt: Date
  updatedAt: Date
}
```

### Lesson Model
```typescript
{
  _id: ObjectId
  unitId: ObjectId (ref: Unit, indexed)
  title: string
  description: string
  order: number
  contentBlocks: Array<{
    type: 'text' | 'heading' | 'list' | 'embed' | 'code'
    content: any
  }>
  createdAt: Date
  updatedAt: Date
}
```

### Material Model
```typescript
{
  _id: ObjectId
  lessonId: ObjectId (ref: Lesson, indexed)
  type: 'PDF' | 'VIDEO' | 'LINK' | 'IMAGE'
  title: string
  url: string
  thumbnailUrl: string (optional)
  metadata: {
    size: number
    duration: number (for videos)
    mimeType: string
  }
  uploadedBy: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Conversation Model
```typescript
{
  _id: ObjectId
  type: 'DIRECT' | 'CLASS'
  classId: ObjectId (ref: Class, indexed, optional)
  participants: ObjectId[] (ref: User, indexed)
  lastMessageAt: Date (indexed)
  createdAt: Date
  updatedAt: Date
}
// Compound index: (type, participants) for DIRECT
// Index: (classId) for CLASS
```

### Message Model
```typescript
{
  _id: ObjectId
  conversationId: ObjectId (ref: Conversation, indexed)
  senderId: ObjectId (ref: User, indexed)
  text: string
  attachments: Array<{
    type: string
    url: string
    name: string
  }>
  readBy: Array<{
    userId: ObjectId (ref: User)
    readAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}
```

### Announcement Model
```typescript
{
  _id: ObjectId
  classId: ObjectId (ref: Class, indexed)
  title: string
  body: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdBy: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Notification Model
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User, indexed)
  type: string // 'ENROLLMENT_REQUEST', 'MESSAGE', 'SESSION_REMINDER', etc.
  title: string
  body: string
  payload: object
  readAt: Date (optional, indexed)
  createdAt: Date
}
```

### AdminAuditLog Model
```typescript
{
  _id: ObjectId
  adminId: ObjectId (ref: User, indexed)
  action: string // 'APPROVE_TEACHER', 'SUSPEND_USER', etc.
  targetType: string // 'TEACHER', 'STUDENT', 'CLASS', etc.
  targetId: ObjectId
  metadata: object
  ipAddress: string
  userAgent: string
  timestamp: Date (indexed)
}
```

### Lead/Inquiry Model
```typescript
{
  _id: ObjectId
  teacherId: ObjectId (ref: User, indexed)
  studentName: string
  grade: string
  contactMethod: 'WHATSAPP' | 'EMAIL'
  contactValue: string
  preferredSubject: string
  message: string
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED'
  source: 'AI_CHAT' | 'CONTACT_FORM' | 'MANUAL'
  createdAt: Date
  updatedAt: Date
}
```

---

## 🛣️ API Routes

### Authentication (`/api/auth`)
```
POST   /api/auth/register              # Register (role-based, optional teacherId/teacherSlug for student-teacher linking)
POST   /api/auth/login                 # Login
POST   /api/auth/refresh               # Refresh access token
POST   /api/auth/logout                # Logout
GET    /api/auth/me                    # Get current user
POST   /api/auth/forgot-password       # Request password reset
POST   /api/auth/reset-password        # Reset password
```

### Admin (`/api/admin`)
```
GET    /api/admin/dashboard            # Dashboard stats
GET    /api/admin/teachers             # List teachers (filter by status)
GET    /api/admin/teachers/:id         # Get teacher details
POST   /api/admin/teachers/:id/approve # Approve teacher
POST   /api/admin/teachers/:id/reject  # Reject teacher
GET    /api/admin/students             # List students
GET    /api/admin/students/:id         # Get student details
GET    /api/admin/classes              # List all classes
GET    /api/admin/analytics            # Analytics data
GET    /api/admin/audit-logs          # Audit logs (paginated)
POST   /api/admin/users/:id/suspend   # Suspend user
POST   /api/admin/users/:id/unsuspend # Unsuspend user
GET    /api/admin/settings            # Get site settings
PUT    /api/admin/settings            # Update site settings
POST   /api/admin/impersonate/:id    # Impersonate teacher (optional)
```

### Teacher (`/api/teacher`)
```
GET    /api/teacher/dashboard          # Teacher dashboard stats
GET    /api/teacher/profile            # Get teacher profile
PUT    /api/teacher/profile            # Update teacher profile
POST   /api/teacher/profile/image      # Upload profile image
POST   /api/teacher/profile/cover      # Upload cover image

GET    /api/teacher/classes            # List teacher's classes
POST   /api/teacher/classes            # Create class
GET    /api/teacher/classes/:id        # Get class details
PUT    /api/teacher/classes/:id        # Update class
DELETE /api/teacher/classes/:id        # Delete class
GET    /api/teacher/classes/:id/students # Get enrolled students
POST   /api/teacher/classes/:id/invite # Generate invite link/code

GET    /api/teacher/enrollments        # List enrollment requests
POST   /api/teacher/enrollments/:id/approve # Approve enrollment
POST   /api/teacher/enrollments/:id/reject  # Reject enrollment

GET    /api/teacher/sessions           # List sessions (with filters)
POST   /api/teacher/sessions           # Create session
GET    /api/teacher/sessions/:id       # Get session details
PUT    /api/teacher/sessions/:id       # Update session
DELETE /api/teacher/sessions/:id      # Delete session

GET    /api/teacher/sessions/:id/attendance # Get attendance for session
POST   /api/teacher/sessions/:id/attendance  # Mark attendance

GET    /api/teacher/classes/:id/units  # Get units for class
POST   /api/teacher/classes/:id/units  # Create unit
PUT    /api/teacher/units/:id          # Update unit
DELETE /api/teacher/units/:id          # Delete unit

GET    /api/teacher/units/:id/lessons  # Get lessons for unit
POST   /api/teacher/units/:id/lessons  # Create lesson
PUT    /api/teacher/lessons/:id        # Update lesson
DELETE /api/teacher/lessons/:id       # Delete lesson

POST   /api/teacher/lessons/:id/materials # Upload material
DELETE /api/teacher/materials/:id     # Delete material

GET    /api/teacher/conversations      # List conversations
GET    /api/teacher/conversations/:id  # Get conversation
POST   /api/teacher/conversations/:id/messages # Send message

GET    /api/teacher/classes/:id/announcements # List announcements
POST   /api/teacher/classes/:id/announcements # Create announcement
PUT    /api/teacher/announcements/:id  # Update announcement
DELETE /api/teacher/announcements/:id  # Delete announcement

GET    /api/teacher/students           # Get teacher's registered/linked students
GET    /api/teacher/leads              # List leads/inquiries
PUT    /api/teacher/leads/:id          # Update lead status

GET    /api/teacher/website/config     # Get teacher's website config
PUT    /api/teacher/website/config     # Update website config
POST   /api/teacher/website/sections/reorder # Reorder sections
PUT    /api/teacher/website/sections/:sectionId # Update section config
```

### Student (`/api/student`)
```
GET    /api/student/dashboard          # Student dashboard
GET    /api/student/profile            # Get student profile
PUT    /api/student/profile            # Update student profile
GET    /api/student/teachers           # Get student's linked teachers

GET    /api/student/classes            # Browse/search classes
GET    /api/student/classes/:id        # Get class details
GET    /api/student/my-classes         # Get enrolled classes
POST   /api/student/classes/:id/enroll # Request enrollment
POST   /api/student/enrollments/:id/cancel # Cancel enrollment request

GET    /api/student/classes/:id/sessions # Get sessions for class
GET    /api/student/classes/:id/calendar # Get calendar view

GET    /api/student/classes/:id/attendance # Get attendance history

GET    /api/student/classes/:id/units   # Get units/lessons/materials
GET    /api/student/lessons/:id         # Get lesson details

GET    /api/student/conversations      # List conversations
GET    /api/student/conversations/:id  # Get conversation
POST   /api/student/conversations/:id/messages # Send message

GET    /api/student/announcements      # Get announcements (for enrolled classes)
GET    /api/student/notifications      # Get notifications
PUT    /api/student/notifications/:id/read # Mark notification as read
```

### Public (`/api/public`)
```
GET    /api/public/teachers            # List public teachers (directory)
GET    /api/public/teachers/:slug      # Get public teacher profile
GET    /api/public/teachers/:slug/classes # Get public classes
GET    /api/public/classes/:id         # Get public class details (limited info)

POST   /api/public/teachers/:slug/contact # Contact form / lead capture
POST   /api/public/ai/chat             # AI chat endpoint (public)
```

### File Upload (`/api/upload`)
```
POST   /api/upload/image               # Upload image (profile, cover, etc.)
POST   /api/upload/document            # Upload PDF/document
POST   /api/upload/video               # Upload video
```

### Query Parameters (for list endpoints)
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `search`: string (search query)
- `sort`: string (field:asc/desc)
- `filter`: object (JSON stringified)

---

## 👥 Features by Role

### Super Admin
- ✅ Approve/reject teacher applications
- ✅ Manage teachers, students, classes
- ✅ View analytics dashboard
- ✅ Impersonate teachers (optional)
- ✅ Suspend/ban users
- ✅ Manage site settings
- ✅ Review audit logs
- ✅ View per-teacher metrics

### Teacher (after approval)
- ✅ Manage profile (bio, image, subjects, grades)
- ✅ Create and manage classes
- ✅ Enroll students (approve requests, invite)
- ✅ Manage lessons (units → lessons → materials)
- ✅ Upload materials (PDF, images, videos)
- ✅ Schedule calendar sessions (one-time + recurring)
- ✅ Mark attendance per session
- ✅ Send messages (class chat, announcements, DMs)
- ✅ Create announcements
- ✅ View dashboard analytics
- ✅ Customize public website
- ✅ Manage leads/inquiries

### Student
- ✅ Register/login (optionally through teacher's public page for auto-linking)
- ✅ Create profile
- ✅ Browse teachers directory and view public profiles
- ✅ Browse/search classes
- ✅ Request enrollment
- ✅ See enrolled classes and linked teachers
- ✅ View class calendar and sessions
- ✅ Access lesson content/materials
- ✅ View attendance history
- ✅ Receive notifications and messages
- ✅ Download PDFs and view videos
- ✅ Access student dashboard

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- MongoDB 6+ (local or Atlas)
- Docker & Docker Compose (optional, for local dev)
- Cloudinary account (for file storage)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd tuition-management-system
```

2. **Install dependencies**
```bash
# Root level (installs all workspace dependencies)
npm install

# Or install individually:
cd apps/api && npm install
cd ../web && npm install
cd ../../packages/shared && npm install
```

3. **Setup environment variables**

Create `.env` files in each app directory:

**apps/api/.env**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tuition-management
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tuition-management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Socket.io
SOCKET_IO_PORT=3001

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI (for public teacher chat)
OPENAI_API_KEY=your-openai-api-key
# OR
ANTHROPIC_API_KEY=your-anthropic-api-key
```

**apps/web/.env**
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3001
```

4. **Start MongoDB** (if not using Docker)
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
```

5. **Run seed script** (optional, for demo data)
```bash
cd apps/api
npm run seed
```

6. **Start development servers**

**Option A: Using Docker Compose**
```bash
docker-compose up
```

**Option B: Manual start**
```bash
# Terminal 1: API
cd apps/api
npm run dev

# Terminal 2: Frontend (single app serves both portals)
cd apps/web
npm run dev
```

7. **Access the applications**
- Admin/Teacher Portal: http://localhost:5173/admin (or /teacher)
- Student Portal: http://localhost:5173/student
- API: http://localhost:3000/api
- Public Teacher Page: http://localhost:5173/t/{teacher-slug}
- Teacher Directory: http://localhost:5173/teachers

### Default Demo Accounts

After running seed script:
- **Super Admin**: admin@example.com / password123
- **Teacher 1**: teacher1@example.com / password123
- **Teacher 2**: teacher2@example.com / password123
- **Student**: student@example.com / password123

---

## 🐳 Deployment

### Docker Setup

**docker-compose.yml** (for production)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/tuition-management
    depends_on:
      - mongodb

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  mongodb_data:
```

### Deployment Platforms

#### Vercel (Frontend)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

#### Railway / Render (Backend)
1. Connect GitHub repository
2. Set start command: `npm start`
3. Add environment variables
4. Provision MongoDB addon

#### AWS / DigitalOcean
1. Use Docker Compose or individual containers
2. Setup reverse proxy (Nginx)
3. Configure SSL (Let's Encrypt)
4. Setup monitoring (PM2, New Relic, etc.)

---

## 🔒 Security Considerations

### Authentication & Authorization
- ✅ JWT tokens with short expiry (15 min access, 7 days refresh)
- ✅ Refresh token rotation
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ Role-based access control (RBAC) guards
- ✅ Rate limiting on auth endpoints
- ✅ CORS configuration

### Data Protection
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (MongoDB parameterized queries)
- ✅ XSS prevention (sanitize user inputs)
- ✅ File upload validation (type, size limits)
- ✅ Secure file storage (Cloudinary signed URLs)

### API Security
- ✅ Helmet.js for security headers
- ✅ Request size limits
- ✅ API key authentication for public endpoints (optional)
- ✅ Audit logging for admin actions

### Privacy
- ✅ Public teacher pages never expose private data
- ✅ Student names hidden in public views
- ✅ Privacy toggles for teacher profiles
- ✅ GDPR considerations (data export, deletion)

---

## 📝 Additional Notes

### Assumptions Made
1. **Timezone**: All dates/times stored in UTC, displayed in user's local timezone
2. **File Size Limits**: 
   - Images: 5MB max
   - PDFs: 10MB max
   - Videos: 100MB max (consider streaming for larger)
3. **Pagination**: Default 20 items per page, max 100
4. **Session Duration**: Default 1 hour, configurable per class
5. **Recurring Sessions**: Support daily, weekly, monthly patterns
6. **AI Model**: Using OpenAI GPT-4 or Anthropic Claude (configurable)

### Future Enhancements
- [ ] Mobile apps (React Native)
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Video conferencing integration (Zoom/Jitsi)
- [ ] Advanced analytics (Google Analytics, custom dashboards)
- [ ] Email notifications (SendGrid, AWS SES)
- [ ] SMS notifications (Twilio)
- [ ] Multi-language support (i18n)
- [ ] White-label customization
- [ ] API rate limiting per user tier
- [ ] Advanced search (Elasticsearch)

### Support & Documentation
- API Documentation: `/api/docs` (Swagger/OpenAPI)
- Component Storybook: `/storybook` (optional)
- Architecture Decision Records: `/docs/adr`

---

## 📄 License

[Specify your license]

---

## 👨‍💻 Contributors

[Your name/team]

---

**Last Updated**: [Current Date]
